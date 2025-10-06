import { MCPTool, logger } from "mcp-framework";
import { z } from "zod";
import { getConnector } from "../server.js";
import { ResourceAccessLevel, CloudInitBootMode, SystemCategory, } from "@taiyi-io/api-connector-ts";
class GuestCreateTool extends MCPTool {
    name = "guest-create";
    description = "创建云主机，支持同步和异步操作，可指定资源池、系统模板、核心数、内存、磁盘等配置";
    schema = {
        poolID: {
            type: z.string(),
            description: "承载云主机的资源池id，必填。可以从mcp-resource://compute-pool/中获取",
        },
        system: {
            type: z.string().optional(),
            description: "云主机创建时使用的系统模板id，能够针对性优化云主机配置参数提高更好的性能与兼容性，可选。不指定时使用默认配置。可以从mcp-resource://system/中获取当前可用系统模板",
        },
        name: {
            type: z.string(),
            description: "云主机名称，允许字母数字和-，字母开头，必填",
        },
        cores: {
            type: z.string(),
            description: "云主机核心数量，1或者2的倍数。不能够超过目标资源池最大核心数，目标资源池允许的最大核心数可以通过mcp-resource://compute-pool/获取",
        },
        memory: {
            type: z.string(),
            description: "以MB为单位的内存容量，比如2GB内存，输入为2048，必填。不能够超过目标资源池最大内存，目标资源池允许的最大内存可以通过mcp-resource://compute-pool/获取",
        },
        disks: {
            type: z.string(),
            description: '以MB为单位的磁盘容量，[系统盘,数据盘1，数据盘2]的形式输入，必填。比如创建1G系统磁盘，输入"[1024]";创建2G系统盘，5G数据盘，输入"[2048,5120]";申请磁盘容量不能超过目标资源池限制，目标资源池允许的最大磁盘容量可以通过mcp-resource://compute-pool/获取',
        },
        source_image: {
            type: z.string().optional(),
            description: "克隆创建云主机时的来源磁盘镜像id，创建时自动将磁盘镜像数据复制到新建云主机的系统磁盘，系统磁盘容量必须不小于镜像要求的磁盘空间，为空时创建空白云主机。可用磁盘镜像可以通过mcp-resource://disk-image/获取",
        },
        auto_start: {
            type: z.boolean().optional(),
            description: "云主机开机启动，启用后，服务器启动时自动将云主机开机。默认关闭。",
            default: false,
        },
        cloud_init: {
            type: z.boolean().optional(),
            description: "是否基于CloudInit对云主机进行初始化配置，包括安全的管理员密码和磁盘挂载等功能，需要磁盘镜像的配合，默认关闭。",
            default: false,
        },
        access_level: {
            type: z.nativeEnum(ResourceAccessLevel),
            description: "资源访问级别:private:私有<默认>, share_view:共享查看, share_edit:共享编辑",
            default: ResourceAccessLevel.Private,
        },
    };
    async execute(input) {
        try {
            const connector = await getConnector();
            // 1. 校验name、cores、memory、disks输入值是否合规
            // 校验name格式
            if (!/^[a-zA-Z][a-zA-Z0-9-]*$/.test(input.name)) {
                throw new Error("云主机名称格式错误：必须以字母开头，只能包含字母、数字和连字符");
            }
            // 校验cores是否为1或2的倍数
            const coresNum = parseInt(input.cores, 10);
            if (isNaN(coresNum) || (coresNum !== 1 && coresNum % 2 !== 0)) {
                throw new Error("核心数量必须是1或2的倍数");
            }
            // 校验memory是否为有效数字
            const memoryNum = parseInt(input.memory, 10);
            if (isNaN(memoryNum) || memoryNum <= 0) {
                throw new Error("内存容量必须是大于0的数字");
            }
            // 校验disks格式并解析
            let disksArray;
            disksArray = JSON.parse(input.disks);
            if (!Array.isArray(disksArray) || disksArray.length === 0) {
                throw new Error("磁盘配置必须是非空数组");
            }
            for (const diskSize of disksArray) {
                if (typeof diskSize !== "number" || diskSize <= 0) {
                    throw new Error("磁盘容量必须是大于0的数字");
                }
            }
            const systemDiskSize = disksArray[0];
            // 2. 调用connector.getComputepool校验poolID
            const poolResult = await connector.getComputePool(input.poolID);
            if (poolResult.error) {
                throw new Error(`资源池校验失败：${poolResult.error}`);
            }
            else if (!poolResult.data) {
                throw new Error(`无效资源池：${input.poolID}`);
            }
            const targetPool = poolResult.data;
            //check cores
            if (coresNum > targetPool.resource.cores) {
                throw new Error(`核心数量超过目标资源池最大核心数：${targetPool.resource.cores}`);
            }
            //check memory
            if (memoryNum > targetPool.resource.memory) {
                throw new Error(`内存容量超过目标资源池最大内存：${targetPool.resource.memory}`);
            }
            //check disk
            for (const diskSize of disksArray) {
                if (diskSize > targetPool.resource.disk) {
                    throw new Error(`磁盘容量超过目标资源池最大磁盘：${targetPool.resource.disk}`);
                }
            }
            // 3. 如果source_image，调用connector.getSystem校验
            if (input.source_image) {
                const imageResult = await connector.getDiskFile(input.source_image);
                if (imageResult.error) {
                    throw new Error(`磁盘镜像校验失败：${imageResult.error}`);
                }
                else if (!imageResult.data) {
                    throw new Error(`无效磁盘镜像：${input.source_image}`);
                }
                const sourceImage = imageResult.data;
                if (sourceImage.volume_size_in_mb &&
                    sourceImage.volume_size_in_mb > systemDiskSize) {
                    throw new Error(`系统磁盘容量不能小于镜像要求的磁盘空间：${sourceImage.volume_size_in_mb}MB`);
                }
            }
            let defaultUserName = "root";
            if (input.system) {
                //fetch system
                const systemResult = await connector.getSystem(input.system);
                if (systemResult.error) {
                    throw new Error(`系统校验失败：${systemResult.error}`);
                }
                else if (!systemResult.data) {
                    throw new Error(`无效系统：${input.system}`);
                }
                const targetSystem = systemResult.data;
                if (targetSystem.category == SystemCategory.Windows) {
                    defaultUserName = "Administrator";
                }
            }
            // 4. 构建GuestConfig
            let guestConfig = {
                name: input.name,
                cores: coresNum,
                memory: memoryNum,
                disks: disksArray,
                source_image: input.source_image,
                auto_start: input.auto_start,
                access_level: input.access_level,
            };
            // 5. 如果cloud_init=true，构建ControlCloudInitConfig
            if (input.cloud_init) {
                const cloudInit = {
                    boot_mode: CloudInitBootMode.ISO,
                    default_user: {
                        name: defaultUserName,
                    },
                };
                guestConfig.cloud_init = cloudInit;
            }
            // 6. 调用tryCreateGuest
            const result = await connector.tryCreateGuest(input.poolID, input.system || "", guestConfig);
            if (result.error) {
                throw new Error(result.error);
            }
            else if (!result.data) {
                throw new Error("创建云主机失败：获取任务ID失败");
            }
            const taskID = result.data;
            return `新任务${taskID}已启动，创建云主机${input.name}。可调用mcp-tool:check-task检查执行结果`;
        }
        catch (error) {
            const output = `创建云主机失败: ${error instanceof Error ? error.message : String(error)}`;
            logger.error(output);
            return output;
        }
    }
}
export default GuestCreateTool;

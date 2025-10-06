import { MCPResource, ResourceContent } from "mcp-framework";
/**
 * 任务列表资源
 * 返回当前用户可以访问的所有任务列表
 */
declare class TaskListResource extends MCPResource {
    uri: string;
    name: string;
    description: string;
    mimeType: string;
    read(): Promise<ResourceContent[]>;
    /**
     * 分页获取所有任务列表
     * 参考getAllDiskImages实现
     */
    private getAllTasks;
}
export default TaskListResource;

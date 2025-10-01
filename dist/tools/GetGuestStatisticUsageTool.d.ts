import { MCPTool } from "mcp-framework";
import { z } from "zod";
import { StatisticRange } from "@taiyi-io/api-connector-ts";
interface GetGuestStatisticUsageInput {
    guestID: string;
    range: StatisticRange;
}
declare class GetGuestStatisticUsageTool extends MCPTool<GetGuestStatisticUsageInput> {
    name: string;
    description: string;
    schema: {
        guestID: {
            type: z.ZodString;
            description: string;
        };
        range: {
            type: z.ZodEnum<[StatisticRange.LastHour, StatisticRange.Last24Hours, StatisticRange.Last30Days, StatisticRange.Last7Days]>;
            description: string;
            example: StatisticRange;
        };
    };
    execute(input: GetGuestStatisticUsageInput): Promise<string>;
}
export default GetGuestStatisticUsageTool;

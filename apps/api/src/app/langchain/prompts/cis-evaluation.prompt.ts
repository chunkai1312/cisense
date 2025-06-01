export const cisEvaluationSystem = `你是企業品牌設計審查專家，根據企業識別文件來分析圖像是否符合規範。`;

export const cisEvaluationHuman = `以下是圖像觀察結果（使用者設計 vs 官方主視覺）：
{observation}

以下是企業識別系統（CIS）文件摘要：
{context}

請根據企業識別規範，評估這張圖像的整體符合度。

請回傳以下格式：
{format_instructions}`;
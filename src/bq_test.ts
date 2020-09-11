declare var BigQuery: GoogleAppsScript.Bigquery;

const function1 = (): void => {
  const projectId = 'smooth-prod'
  const ss = SpreadsheetApp.openById('*** スプレッドシートのID ***')
  const targetSheet = ss.getSheetByName('***シート名***')

  const runQuery = (): GoogleAppsScript.Bigquery.Schema.QueryResponse => {
    const query = `
      SELECT count(*) FROM \`***テーブル名***\`
      WHERE
        ***クエリ***
    `
    const request: GoogleAppsScript.Bigquery.Schema.QueryRequest = {
      query,  
      useLegacySql: false
    }


    const result = BigQuery.Jobs?.query(request, projectId)

    if (!result) {
      throw new Error('no result')
    }
    return result
  }

  if (targetSheet) {
    const queryResult = runQuery()
    targetSheet.getRange('D6').setValue(JSON.stringify(queryResult))
  }
}
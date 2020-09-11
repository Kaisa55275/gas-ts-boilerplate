const function1 = (): void => {
  const projectId = 'smooth-prod'
  const ss = SpreadsheetApp.openById('1sfbnz8iP2KhrhAbfD8gPksrbFmsvmvgCbdB2_ITH_fk')
  const targetSheet = ss.getSheetByName('バージョン毎の日程登録率')

  const runQuery = (): GoogleAppsScript.Bigquery.Schema.QueryResponse => {
    const request: GoogleAppsScript.Bigquery.Schema.QueryRequest = {
      query: `
        SELECT count(*) FROM 'smooth-prod.analyse_table.format_mysql_dump'
        WHERE
          partition_date = "2020-09-11"
          and user_is_test is not true
          and user_id >= 1944
          and ses_result = "通過"
          and not((search_status & 2) > 0)
      `
    }
    const result = Bigquery.Jobs?.query(request, projectId)

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
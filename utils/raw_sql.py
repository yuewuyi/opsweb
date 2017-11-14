def getsql(sqlName):
    sqldit={}
    #查询应用
    hostAppsql="""
        SELECT h.`id`,
        h.`hostAppName`,
        h.`appPath`,
        h.`appPort`,
        a.`appTemplateName`,
        h.`status`
        from hostApplication as h LEFT JOIN appTemplate as a
        on h.appTempId=a.id
        where hostId=%(hId)s
    """
    #查询web应用
    webAppSql="""
        SELECT
	  w.`id`,
	  t.`webTemplateName`
    FROM
	  webApplication AS w
    LEFT JOIN webTemplate AS t ON t.id = w.webTempId
    WHERE
	  hostAppId = %(aId)s
    """
    sqldit['hostAppsql']=hostAppsql
    sqldit['webAppSql'] = webAppSql
    return sqldit[sqlName]
def rawQuerytoList(rawQuerySet):
    Qlist=[]
    for item in rawQuerySet:
        dit=item.__dict__
        del(dit['_state'])
        Qlist.append(dit)
    return Qlist


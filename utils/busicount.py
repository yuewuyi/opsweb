import pymysql
import csv
config = {
          'host':'10.175.201.136',
          'port':3306,
          'user':'root',
          'password':'Pass1234',
          'db':'busidb',
          'charset':'utf8mb4',
          }
start="2017-03-22 00:00:00"
end="2017-03-23 00:00:00"
transdate="2017-03-22"
sum_data = []
sum_data.append(['药店名', '总pc量', '未推荐药品', '推荐两种药品', '推荐三种以上药品', '处方量', '首推处方量', '首推药品盒数', '首推药品金额', '处方总金额', '平均客单价'])
def data(start,end,transdate,config,storename):
    pr_data=[]
    sql=''
    pr_data.append(storename)
    connection = pymysql.connect(**config)
    cursor = connection.cursor()
    #药店ID
    cursor.execute("SELECT store_id from b_store where cn_name like '%"+storename+"%'")
    storeid = str(cursor.fetchone()[0])
    #PC设备总量
    sql="select count(*) from b_pc_busi where store_id="+storeid +" and end_time>='"+start+"' and  end_time<'"+end+"'"
    cursor.execute(sql)
    pr_data.append(str(cursor.fetchone()[0]))
    # 未推荐药品
    sql="SELECT COUNT(*) from b_pc_busi where has_drug=0 and store_id="+storeid+" and end_time>='"+start+"' and  end_time<'"+end+"'"
    cursor.execute(sql)
    pr_data.append(str(cursor.fetchone()[0]))
    #推荐两种药品
    sql="SELECT  two_count from b_drug_rcmd_sum where store_id="+storeid+" and trans_date ='"+transdate+"'"
    cursor.execute(sql)
    try:
        pr_data.append(str(cursor.fetchone()[0]))
    except:
        pr_data.append('0')
    #推荐三种及以上
    sql="SELECT  three_count,four_count,five_count from b_drug_rcmd_sum where store_id="+storeid+" and trans_date ='"+transdate+"'"
    cursor.execute(sql)
    try:
        pr_data.append(str(cursor.fetchone()[0]))
    except:
        pr_data.append('0')
    #处方量
    sql="SELECT pres_count from b_drug_rcmd_sum where store_id="+storeid+" and trans_date ='"+transdate+"'"
    cursor.execute(sql)
    try:
        pr_data.append(str(cursor.fetchone()[0]))
    except:
        pr_data.append('0')
    #首推处方量
    sql="SELECT drug_s_times from b_drug_rcmd_sum where store_id="+storeid+" and trans_date ='"+transdate+"'"
    cursor.execute(sql)
    try:
        pr_data.append(str(cursor.fetchone()[0]))
    except:
        pr_data.append('0')
    #首推药品盒数
    sql="SELECT drug_s_numbers from b_drug_rcmd_sum where store_id="+storeid+" and trans_date ='"+transdate+"'"
    cursor.execute(sql)
    try:
        pr_data.append(str(cursor.fetchone()[0]))
    except:
        pr_data.append('0')
    #首推药品金额
    sql="SELECT drug_s_price from b_drug_rcmd_sum where store_id="+storeid+" and trans_date ='"+transdate+"'"
    cursor.execute(str(sql))
    try:
        pr_data.append(str(cursor.fetchone()[0]))
    except:
        pr_data.append('0')
    #处方总金额
    sql="SELECT sum_price from b_drug_rcmd_sum where store_id="+storeid+" and trans_date ='"+transdate+"'"
    cursor.execute(str(sql))
    try:
        pr_data.append(str(cursor.fetchone()[0]))
    except:
        pr_data.append('0')
    #平均客单价
    sql="SELECT ave_price from b_drug_rcmd_sum where store_id="+storeid+" and trans_date ='"+transdate+"'"
    cursor.execute(sql)
    try:
        pr_data.append(str(cursor.fetchone()[0]))
    except:
        pr_data.append('0')
    connection.close()
    return pr_data
store_name=['幸福人医药光明店',
            '幸福人医药清华园店',
            '幸福人医药新兴店',
            '幸福人医药福盈店',
            '幸福人医药振兴店',
            '幸福人医药杏花村店',
            '幸福人医药青檀店',
            '幸福人医药福安店',
            '幸福人医药安居店',
            '幸福人医药福临店',
            '幸福人医药阳光店',
            '幸福人医药健康店',
            '幸福人医药文化店',
            '幸福人医药春蕾店',
            '幸福人医药中心店']
for item in store_name:
    sum_data.append(data(start, end, transdate, config,item))
    file=open('枣庄幸福人连锁数据统计-'+transdate+'.csv', 'w',newline='')
    spamwriter = csv.writer(file, dialect='excel')
    for item in sum_data:
        spamwriter.writerow(item)
    file.close()
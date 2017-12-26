from numpy import *

class cluster:
    def __init__(self,data):
        if len(shape(data))==1:
            newData=[]
            for item in data:
                newData.append([1.0,item])
            data=newData
        self.__data=mat(data)
    #欧氏距离公式 sqrt( (x1-x2)^2+(y1-y2)^2 )
    def distEclud(self,vecA,vecB):
        return sqrt(sum(power(vecA-vecB,2)))
    #获得K个随机质心
    def randCent(self,dataSet,k):
        #获取数据集的列数
        n=shape(dataSet)[1]
        #初始化k行n列的矩阵
        centroids=mat(zeros((k,n)))
        for j in range(n):
            #获取特征列中的最小距离
            minJ=min(dataSet[:,j])
            #计算最大值与最小值的距离
            rangeJ=float(max(dataSet[:,j])-minJ)
            #最小的值加上范围距离*随机0,1之间的数，确保随机质心在数据集取值范围内
            centroids[:,j]=minJ+rangeJ*random.rand(k,1)
        return centroids
    #k均值聚类
    def kMeans(self,dataSet,k):
        #获取数据集的行数
        m=shape(dataSet)[0]
        #创建K个随机质心
        centroids=self.randCent(dataSet,k)
        #生成值为0的m行2列的矩阵,第一列存放质心的index，第二列存放距离
        clusterAssment=mat(zeros((m,2)))
        #初始化聚类切换为True
        clusterChanged=True
        while clusterChanged:
            clusterChanged=False
            #数据集循环（遍历所有行）
            for i in range(m):
                #初始化最小距离
                minDist=inf
                #初始化最小距离的索引
                minIndex=-1
                #计算当前点与所有质心的距离,并存储最小距离的质心位置，以及到质心的距离
                for j in range(k):
                    distJI=self.distEclud(centroids[j],dataSet[i])
                    if distJI <minDist:
                        minDist=distJI
                        minIndex=j
                #当索引不再改变时跳出循环
                if clusterAssment[i,0] !=minIndex:
                    clusterChanged=True
                clusterAssment[i]=minIndex,minDist**2
            for cent in range(k):
                #得到相应簇心中的所有点
                ptsInClust=dataSet[nonzero(clusterAssment[:,0].A==cent)[0]]
                #根据簇心的平均值重新计算质心
                centroids[cent]=mean(ptsInClust,axis=0)
        return centroids,clusterAssment
    def biKmeans(self,dataSet,k):
        #获取行数
        m=shape(dataSet)[0]
        #生成m行2列的矩阵
        clusterAssment=mat(zeros((m,2)))
        #根据平均值创建一个初始簇
        centroid0=mean(dataSet,axis=0).tolist()[0]
        centList=[centroid0]
        #计算每个点到初始簇心的距离
        for i in range(m):
            clusterAssment[i,1]=self.distEclud(mat([centroid0]),dataSet[i])**2
        while(len(centList) <k ):
            lowestSSE=inf
            for i in range(len(centList)):
                ptsInCurrCluster=dataSet[nonzero(clusterAssment[:,0].A==i)[0]]
                #把每个簇分成两份
                centroidMat,splitClustAss=self.kMeans(ptsInCurrCluster,2)
                #一分为2后的总误差
                sseSplit=sum(splitClustAss[:,1])
                #总误差
                sseNotSpit=sum(clusterAssment[nonzero(clusterAssment[:,0].A!=i)[0],1])
                if (sseNotSpit+sseSplit)<lowestSSE:
                    bestCentToSplit=i
                    bestNewCents=centroidMat
                    bestClustAss=splitClustAss.copy()
                    lowestSSE=sseNotSpit+sseSplit
            bestClustAss[nonzero(bestClustAss[:,0].A==1)[0],0]=len(centList)
            bestClustAss[nonzero(bestClustAss[:,0].A == 0)[0], 0] = bestCentToSplit
            centList[bestCentToSplit]=bestNewCents[0]
            centList.append(bestNewCents[1])
            clusterAssment[nonzero(clusterAssment[:,0].A==bestCentToSplit)[0]]=bestClustAss
        return centList,clusterAssment
    def calcCluster(self):
        return self.biKmeans(self.__data,3)



import math
class page:
    def __init__(self,pageSize,pageId):
        self.pageSize=pageSize
        self.pageId=pageId
        self.pageDit = {"lt": True, "nt": True, "pageList": [],"pageId":pageId}
    def calcPageNum(self):
        Start = (self.pageId - 1) * self.pageSize
        End = Start + self.pageSize
        return Start,End
    def calcPage(self,count):
        pageNumber = math.ceil(float(count) / float(self.pageSize))
        self.pageDit['pageList'] = [i for i in range(1, pageNumber + 1)]
        if len(self.pageDit['pageList']) != 0:
            if self.pageId == self.pageDit['pageList'][0]:
                self.pageDit['lt'] = False
            if self.pageId == self.pageDit['pageList'][-1]:
                self.pageDit['nt'] = False
        return self.pageDit


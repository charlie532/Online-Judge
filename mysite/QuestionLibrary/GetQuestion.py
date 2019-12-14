from DataBase.models import Question
import hashlib
import time
import json

def responseGetQuestion(questionNum,questionPage,questionSequence,questionTarget,questionDegree,selectClass):
    questionList=Question.objects.all()
    #if questionTarget!='tag':
    #    questionList=questionList.filter(Question_Category__contains=questionTarget)
    if questionDegree!='degree':
        questionList=questionList.filter(Question_difficulty__exact=questionDegree)
    if questionSequence=='id':
        questionList=questionList.order_by('id')
    elif questionSequence=='tag':
        questionList=questionList.order_by('tag')
    elif questionSequence=='degree':
        questionList=questionList.order_by('degree')
    elif questionSequence=='percentagePassing':
        questionList=questionList.order_by('percentagePassing')
    elif questionSequence=='respondent':
        questionList=questionList.order_by('respondent')
    elif questionSequence=='inputTime':
        questionList=questionList.order_by('inputTime')
    retQuesData=[]
    for eachQues in questionList:
        Qdata = {
            "id":eachQues.Question_ID,
            "tltle":eachQues.Question_Name,  
            "target":eachQues.Question_Category.all(),
            "degree":eachQues.Question_difficulty,
            "percentagePassing":'{:.2%}'.format(eachQues.Question_AC_Count/eachQues.Question_Summit_Time),
            "respondent":"100",
            "inputTime":eachQues.Question_Create_Time,
        }
        retQuesData.append(json.dumps(Qdata))
    return json.dumps(retQuesData)

'''
class Question(models.Model):
    Question_Name = models.CharField(max_length = 40) # no name longer than 40
    Question_ID = models.CharField(max_length = 40) # no name longer than 40
    Question_Current_Count = models.PositiveIntegerField(default = 1)
    Question_difficulty = models.CharField(max_length = 10 ,default = 'normal') # no name longer than 10
    Question_Category = models.ManyToManyField('Category', blank=True, related_name='Category')
    Question_AC_Count = models.PositiveIntegerField(default = 0)
    Question_Summit_Time = models.PositiveIntegerField(default = 0)
    Question_Create_Time = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.Question_Name
'''

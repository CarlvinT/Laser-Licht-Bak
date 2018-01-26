from subprocess import call

noLightFile = 'noLight.csv'
hasLightFile = 'hasLight.csv'

def displayFile(fileName):

    with open(fileName, 'r') as theFile:

        fileContent = theFile.read()

        print("data: {}".format(fileContent))
    
        return fileContent
def clear():

    clearFile(noLightFile)
    clearFile(hasLightFile)

def checkData():

    lightCount =  int(displayFile(hasLightFile))
    noLightCount = int(displayFile(noLightFile))

    if noLightCount > 8 or lightCount > 8:

        sendToTTN()
        clear()
       
def clearFile(fileName):

    open(fileName, 'w').write('0')
        

def sendToTTN():

    call(["sudo", "../lmic_pi/examples/thethingsnetwork-send-v1/thethingsnetwork-send-v1"])    



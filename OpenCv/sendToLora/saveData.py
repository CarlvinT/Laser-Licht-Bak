import sys
import sendData

def clear(fileName):
    
    with open(fileName, 'w') as theFile: 
        
        theFile.write(0)
   
def addBiker(hasLight):

    if hasLight == 1:

        addLight('hasLight.csv')

    else:

        addLight('noLight.csv')

def displayFile(fileName):

    with open(fileName, 'r') as theFile:

        fileContent = theFile.read()
        
        return fileContent
        
def addLight(fileName):

    lightCount = int(displayFile(fileName)) + 1

    with open(fileName, 'w') as theFile:
        
        if theFile.read() == 0 | theFile.read().length < 1:

                theFile.write("{}".format(1))

        else:
            
              theFile.write("{}".format(lightCount))
         
    if lightCount > 8:
        
        sendData.sendToTTN()
        clear(fileName)

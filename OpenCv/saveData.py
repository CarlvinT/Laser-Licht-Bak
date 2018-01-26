import sys
import sendData

def addBiker(hasLight):

    if hasLight == 1:

        addLight('hasLight.csv')

    else:

        addLight('noLight.csv')

    sendData.checkData()

def displayFile(fileName):

    with open(fileName, 'r') as theFile:

        fileContent = theFile.read()

        print("test: {}".format(fileContent))
        return fileContent

def addLight(fileName):

    lightCount = displayFile(fileName)

    lc = int(lightCount)

    print(type(lc))

    with open(fileName, 'w') as theFile:

        theFile.write("{}".format(lc+1))



import time, sys, stomp, json
from imageWriter import processImage

done = False

# Set Apollo Username/Password
apollo_user = "club"
apollo_pass = "musichouse"

class MyListener(object):
	def __init__(self):
		self.done = False
		print("Connected to Apache Apollo")
	def on_error(self, headers, message):
		print('received an error')
	def on_message(self, headers, message):
		if(self.done == False):
			otp = json.loads(message)
			for x in otp:
				print "Processing Card for " + x['studentName']
				fn = processImage("template/template.jpg", x['studentName'], x['course'],x['studentID'])
				data = {}
				data['studentName'] = x['studentName']
				data['course'] = x['course']
				data['imagefile'] = fn
				conn.send(body=json.dumps(data), destination='/queue/fromPython')
			self.done = True
	def on_disconnected(self):
		print "Connecting to Apollo"		

conn = stomp.Connection([('127.0.0.1',61613)])
conn.set_listener('', MyListener())
conn.start()
conn.connect(apollo_user, apollo_pass)
connected = True

conn.subscribe(destination='/queue/toPython', id=1)

# Keeps this script going on an endless loop
def runServer():
	print("Process Cards Printer Script Now Running....")
	while 1:
		time.sleep(10)
		
if connected:
	runServer()

# conn.disconnect()
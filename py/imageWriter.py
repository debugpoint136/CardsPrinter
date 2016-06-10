import os, sys, random
from PIL import Image, ImageDraw, ImageFont

titleFont = ImageFont.truetype('font/KeepCalm-Medium.ttf',19)
subFont = ImageFont.truetype('font/KeepCalm-Medium.ttf',12)

def processImage(image,titleText,subText,studentCode):
	# Opens the image using the Py Image Lib and converts it to add an Alpha channel
	image = Image.open(image).convert('RGBA')

	# Create a new overlay image with a transparent background
	txtOverlay = Image.new('RGBA', image.size, (255,255,255,0))
	
	# Open the overlay in draw mode
	draw = ImageDraw.Draw(txtOverlay)

	# The next 3 lines draw the text on the image
	draw.text((30,106), titleText, font=titleFont, fill=(0,0,0,255))
	draw.text((30,133), subText, font=subFont, fill=(0,0,200,255))
	draw.text((30,153), "ID: "+studentCode, font=subFont, fill=(0,0,0,200))
	
	# This composites the overlay with the text data back on to the template.jpg image
	out = Image.alpha_composite(image, txtOverlay)

	# Generate a random filename
	fileName = str(int(random.random() * 1000000))

	# Save the composited final image as a jpg with the randomly generated filename
	out.save("../output/" + fileName + ".jpg")

	# Return that filename back to the processCards.py script
	return fileName + ".jpg"



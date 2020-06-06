import os
import json
from flask import Flask, render_template, request, redirect, url_for, jsonify, Response 
import urllib.parse

app = Flask(__name__)

@app.route('/')
def index():
	return render_template("index.html")
	
@app.route("/api/get_vacation_data")
def get_vacation_data():
	filename = os.path.join(app.static_folder, 'vacations.json')
	with open(filename) as vacation_file:
		vacation_data = json.load(vacation_file)
	
	return jsonify(vacation_data)
	
@app.route("/api/add_vacation_data", methods = ['GET','POST'])
def add_vacation_data():
	data_json=request.get_json()
		
	filename = os.path.join(app.static_folder, 'vacations.json')
	with open(filename) as file:
		vacation_data_add = json.load(file)
		
		vacation_data_add.append(data_json)
	
	with open(filename, 'w') as file:
		json.dump(vacation_data_add, file, indent=4)

	return jsonify(vacation_data_add)
	
@app.route("/api/remove_vacation_data", methods = ['GET','POST'])
def remove_vacation_data():
	data_json=request.get_json()
	
	filename = os.path.join(app.static_folder, 'vacations.json')
	with open(filename) as file:
		vacation_data_remove = json.load(file)
		
		vacation_data_remove.remove(data_json)
	
	with open(filename, 'w') as file:
		json.dump(vacation_data_remove, file, indent=4)

	return jsonify(vacation_data_remove)
	
@app.route("/api/get_events_data")
def get_events_data():
	filename = os.path.join(app.static_folder, 'events.json')
	with open(filename) as event_file:
		event_data = json.load(event_file)
	
	return jsonify(event_data)

@app.route("/api/add_events_data", methods = ['GET','POST'])
def add_events_data():
	data_json=request.get_json()
		
	filename = os.path.join(app.static_folder, 'events.json')
	with open(filename) as file:
		event_data_add = json.load(file)
		
		event_data_add.append(data_json)
	
	with open(filename, 'w') as file:
		json.dump(event_data_add, file, indent=4)

	return jsonify(event_data_add)
	
@app.route("/api/remove_events_data", methods = ['GET','POST'])
def remove_events_data():
	data_json=request.get_json()
	
	filename = os.path.join(app.static_folder, 'events.json')
	with open(filename) as file:
		event_data_remove = json.load(file)
		
		event_data_remove.remove(data_json)
		
	with open(filename, 'w') as file:
		json.dump(event_data_remove, file, indent=4)

	return jsonify(event_data_remove)
	
@app.route("/api/edit_events_data", methods = ['GET','POST'])
def edit_events_data():
	data_json=request.get_json()

	filename = os.path.join(app.static_folder, 'events.json')
	with open(filename) as file:
		event_data_edit = json.load(file)
		
		event_data_edit[data_json['n']]['color']=data_json['color']
		event_data_edit[data_json['n']]['text']=data_json['text']
		
	with open(filename, 'w') as file:
		json.dump(event_data_edit, file, indent=4)

	return jsonify(event_data_edit)
	
if __name__ == '__main__':
	app.run(debug=True)

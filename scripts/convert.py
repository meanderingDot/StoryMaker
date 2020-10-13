#!/usr/bin/env python3

# Converts old stories into new JSON format

import json
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("file", help="file name to convert")
parser.add_argument("-o", "--outfile", help="optional new file name for output")
args = parser.parse_args()

if(args.outfile):
	outfile_name = args.outfile
else:
	outfile_name = args.file.replace("txt","json")

with open(args.file, "r") as f:
	old_format = f.read()

json_output = {}
nodes = old_format.split("#")
for node in nodes:
	if len(node):
		split_node = node.split("`")
		node_id = split_node[0]
		title = split_node[1]
		body = split_node[2]
		options = split_node[3]
		option_array = []
		if len(options):
			split_options = options.split("~")
			for opt in split_options:
				if len(opt):
					opt_title , _ , opt_id = opt.partition("^")
					option_array.append({"id":opt_id,"title":opt_title})
		json_output[node_id] = { 
			"title":title, 
			"body":body,
			"options":option_array
		}

with open(outfile_name, "w") as f:
	json.dump(json_output, f)

print("File converted!")
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-base")
model = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-base")

app = Flask(__name__)
CORS(app)
app.config["DEBUG"] = True


@app.route('/', methods=['GET', 'POST'])
def home():
    if request.method =='POST':
        input = request.json['prompt']
        inputs = tokenizer(input, return_tensors="pt")
        outputs = model.generate(**inputs, max_new_tokens=3000)
        output = tokenizer.batch_decode(outputs, skip_special_tokens=True)
        print(output)
        return jsonify({"bot": ' '.join(output)})
    else:
      return "Hello from python server!"

app.run()
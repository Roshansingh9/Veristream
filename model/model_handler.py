import json
import sys
import os
import torch
from transformers import BertTokenizerFast, BertModel
import torch.nn as nn

# Define the model architecture
class CustomBertClassifier(nn.Module):
    def __init__(self, num_labels):
        super(CustomBertClassifier, self).__init__()
        self.bert = BertModel.from_pretrained("bert-base-uncased")
        self.fc1 = nn.Linear(768, 512)
        self.fc2 = nn.Linear(512, num_labels)

    def forward(self, input_ids, attention_mask):
        outputs = self.bert(input_ids=input_ids, attention_mask=attention_mask)
        pooled_output = outputs.pooler_output
        x = self.fc1(pooled_output)
        x = torch.relu(x)
        x = self.fc2(x)
        return x


def load_model_and_tokenizer():
    model_path = os.path.join(os.getcwd(), "model", "model_directory", "model_weights.pth")
    tokenizer_path = os.path.join(os.getcwd(), "model", "model_directory")

    tokenizer = BertTokenizerFast.from_pretrained(tokenizer_path)
    model = CustomBertClassifier(num_labels=2)
    model.load_state_dict(torch.load(model_path))
    model.eval()

    return model, tokenizer


def predict(text, model, tokenizer):
    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=128
    )
    input_ids = inputs["input_ids"]
    attention_mask = inputs["attention_mask"]

    with torch.no_grad():
        logits = model(input_ids=input_ids, attention_mask=attention_mask)
        probabilities = torch.softmax(logits, dim=1).squeeze().tolist()

    return probabilities


def main():
    input_file = sys.argv[1]
    output_file = sys.argv[2]

    # Load the input text
    with open(input_file, "r") as f:
        transcript = f.read()

    model, tokenizer = load_model_and_tokenizer()
    lines = transcript.split("\n")
    results = []

    for line in lines:
        if line.strip():
            probabilities = predict(line, model, tokenizer)
            label = "True" if probabilities[0] > probabilities[1] else "False"
            results.append({"text": line, "label": label, "probabilities": probabilities})

    # Write the output JSON
    with open(output_file, "w") as f:
        json.dump(results, f, indent=4)


if __name__ == "__main__":
    main()

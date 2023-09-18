import openai
import argparse

openai.api_type = "azure"
openai.api_base = "https://kartiktelemetry.openai.azure.com/"
openai.api_version = "2023-03-15-preview"
openai.api_key = "a8fda10f56f5460b93b9b442d35dc1ab"

def modify_file_with_prompt(file_content, prompt):
    response = openai.ChatCompletion.create(
        engine="kartik_telemetry",  
        messages=[
            {"role": "system", "content": "You are code assistant to add telemetry."},
            {"role": "user", "content": file_content},
        ]
    )
    generated_text = response.choices[0].message["content"].strip()

    return generated_text

def main():
    parser = argparse.ArgumentParser(description="Modify file with OpenAI GPT-3")
    parser.add_argument("--file_content", required=True, help="File content to be modified")
    parser.add_argument("--prompt", required=True, help="Prompt for modification")

    args = parser.parse_args()
    modified_text = modify_file_with_prompt(args.file_content, args.prompt)
    print("Modified file content:")
    print(modified_text)

if __name__ == "__main__":
    main()

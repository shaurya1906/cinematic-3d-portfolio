import urllib.request
from html.parser import HTMLParser
import sys

class YCParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_h1 = False
        self.texts = []
        self.current_text = ""

    def handle_starttag(self, tag, attrs):
        if tag == 'h1':
            self.in_h1 = True

    def handle_endtag(self, tag):
        if tag == 'h1':
            self.in_h1 = False
            if self.current_text.strip():
                self.texts.append(self.current_text.strip())
            self.current_text = ""

    def handle_data(self, data):
        if self.in_h1:
            self.current_text += data

def scrape():
    url = "https://www.ycombinator.com/"
    print(f"Scraping {url} for <h1> tags...")
    req = urllib.request.Request(
        url, 
        headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    )
    try:
        response = urllib.request.urlopen(req)
        html = response.read().decode('utf-8')
        
        parser = YCParser()
        parser.feed(html)
        
        print("\nExtracted <h1> texts:")
        if not parser.texts:
            print("No <h1> tags found.")
        for i, text in enumerate(parser.texts, 1):
            print(f"{i}. {text}")
            
    except Exception as e:
        print(f"Error occurred during scraping: {e}")
        sys.exit(1)

if __name__ == "__main__":
    scrape()

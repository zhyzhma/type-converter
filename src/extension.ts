import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('extension.showNumberConverter', () => {
    const panel = vscode.window.createWebviewPanel(
      'numberConverter',
      'Number Converter',
      vscode.ViewColumn.Two,
      {
        enableScripts: true,
      }
    );

    panel.webview.html = getWebviewContent();
  });

  context.subscriptions.push(disposable);

  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBarItem.text = 'Number Converter';
  statusBarItem.command = 'extension.showNumberConverter';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);
}

function getWebviewContent() {
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Number Converter</title>
	  <style>
        input, select {
          background-color:rgb(65, 65, 65);
          border: 0px;
          padding: 3px;
          font-size: 14px;
		  color: white;
		  margin-bottom: 10px;
        }

        button {
          padding: 5px 10px;
          background-color: #4A90E2;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 16px;
          cursor: pointer;
		  margin-top: 10px;
        }

        button:hover {
          background-color: #357ABD; /* Цвет кнопки при наведении */
        }

      </style>
    </head>
    <body>
      <h2>Number Converter</h2>
      <label for="inputNumber">Enter number:</label>
      <input type="text" id="inputNumber" />
      <br/>
      <label for="fromBase">From Base:</label>
      <select id="fromBase">
        <option value="2">Binary</option>
		    <option value="8">Octal</option>
        <option value="10" selected>Decimal</option>
        <option value="16">Hexadecimal</option>
		    <option value="ascii">ASCII</option>
      </select>
      <br/>
      <button onclick="convert()">Convert</button>
      <h3>Converted Values:</h3>
      <ul id="results">
      </ul>

      <script>
        function convert() {
          const inputNumbers = document.getElementById('inputNumber').value;
          const fromBase = document.getElementById('fromBase').value;

          let results = {};

          if (fromBase == "ascii") {
            numbers = Array.from(inputNumbers).map(char => char.charCodeAt(0));
            const binaryResults = numbers.map(num => num.toString(2)).join(' ');
            const octalResults = numbers.map(num => num.toString(8)).join(' ');
            const decimalResults = numbers.map(num => num.toString(10)).join(' ');
            const hexadecimalResults = numbers.map(num => num.toString(16)).join(' ');

            results = {
              Binary: binaryResults,
              Octal: octalResults,
              Decimal: decimalResults,
              Hexadecimal: hexadecimalResults.toUpperCase(),
              ASCII: inputNumbers
            };

          } else {
            const stringNumbers = inputNumbers.split(" ");
            const intNumbers = stringNumbers.map(str => parseInt(str, parseInt(fromBase)));

            if (intNumbers.some(num => isNaN(num))) {
              alert('Invalid input');
              return;
            }	

            const binaryResults = intNumbers.map(num => num.toString(2)).join(' ');
            const octalResults = intNumbers.map(num => num.toString(8)).join(' ');
            const decimalResults = intNumbers.map(num => num.toString(10)).join(' ');
            const hexadecimalResults = intNumbers.map(num => num.toString(16)).join(' ');
            const asciiResults = intNumbers.map(num => String.fromCharCode(num)).join('');

            results = {
              Binary: binaryResults,
              Octal: octalResults,
              Decimal: decimalResults,
              Hexadecimal: hexadecimalResults.toUpperCase(),
              ASCII: asciiResults
            };
          }

          const resultsList = document.getElementById('results');
          resultsList.innerHTML = '';
          for (let [base, value] of Object.entries(results)) {
            const listItem = document.createElement('li');
            listItem.textContent = base + ': ' + results[base];
            resultsList.appendChild(listItem);
          }
        }
      </script>
    </body>
    </html>`;
}

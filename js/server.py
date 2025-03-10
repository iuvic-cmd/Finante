from flask import Flask, request, jsonify
import subprocess

app = Flask(__name__)

@app.route('/export-to-excel', methods=['POST'])
def export_to_excel():
    data = request.json
    # Вызов Python-скрипта для экспорта данных
    result = subprocess.run(
        ['python3', 'export_to_excel.py'],
        input=json.dumps(data),
        text=True,
        capture_output=True
    )
    if result.returncode == 0:
        return jsonify({"message": "Данные успешно экспортированы в Excel."}), 200
    else:
        return jsonify({"error": result.stderr}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

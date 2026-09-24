import os, re

for root, dirs, files in os.walk('src'):
    for f in files:
        if f.endswith(('.tsx', '.ts')):
            p = os.path.join(root, f)
            with open(p, 'r', errors='ignore') as fl:
                c = fl.read()
                matches = re.findall(r'<input[^>]*>', c)
                for inp in matches:
                    if 'coment' in inp.lower() or 'text' in inp.lower():
                        # Find nearby buttons within 300 chars
                        idx = c.find(inp)
                        block = c[idx:idx+800]
                        if '🎁' in block or 'regalo' in block.lower() or 'COMENTAR' in block or 'Comentar' in block:
                            print(f"FOUND in {p} around pos {idx}:")
                            print(block[:400])
                            print("="*60)

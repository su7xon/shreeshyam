import json
import re

def normalize_name(name):
    name = name.lower()
    for b in ['realme', 'samsung', 'oppo', 'vivo', 'hmd', 'nokia', 'itel', 'lava', 'motorola', 'infinix', 'tecno']:
        name = name.replace(b, '')
    
    # Remove things like 4+64, 8+128
    name = re.sub(r'\d+\s*\+\s*\d+', '', name)
    # Remove colors in brackets
    name = re.sub(r'\(.*?\)', '', name)
    # Remove extra spaces
    name = re.sub(r'\s+', ' ', name).strip()
    return name

# Load TS data
ts_content = open('d:/downloadss/shreeshyam mobiles/products-data.ts', 'r', encoding='utf-8').read()
web_products = []
for match in re.finditer(r'name:\s*"([^"]+)",\s*brand:\s*"([^"]+)",\s*price:\s*(\d+),\s*ram:\s*"([^"]+)",\s*storage:\s*"([^"]+)"', ts_content):
    web_products.append({
        'name': match.group(1).lower(),
        'norm_name': normalize_name(match.group(1)),
        'brand': match.group(2).lower(),
        'price': int(match.group(3)),
        'ram': match.group(4).lower().replace('gb', ''),
        'storage': match.group(5).lower().replace('gb', '')
    })

# Load JSON data
json_content = open('d:/downloadss/shreeshyam mobiles/All_Brands_Price_List (1).json', 'r', encoding='utf-8').read()
json_data = json.loads(json_content)

json_flat = []
for brand, products in json_data['brands'].items():
    for p in products:
        json_flat.append({
            'name': p['product_name'].lower(),
            'norm_name': normalize_name(p['product_name']),
            'brand': brand.lower(),
            'price': p['selling_price'],
            'ram': str(p['ram_gb']).lower(),
            'storage': str(p['storage_gb']).lower()
        })

match_count = 0
mismatch_count = 0
not_found = 0

output = "# Price Comparison Report\n\n"
output += "| JSON Product | RAM/Storage | JSON Price | Web Price | Status |\n"
output += "|---|---|---|---|---|\n"

for jp in json_flat:
    # Find matching web product
    # Try exact or partial name match with exact ram/storage
    possible_matches = []
    jp_words = jp['norm_name'].split()
    
    for wp in web_products:
        if wp['brand'] != jp['brand']: continue
        
        # Check ram/storage (handle nulls and 1tb = 1024)
        if jp['ram'] != 'null' and wp['ram'] != 'null' and jp['ram'] != wp['ram']: continue
        
        w_storage = '1024' if wp['storage'] == '1tb' else wp['storage']
        if jp['storage'] != 'null' and wp['storage'] != 'null' and jp['storage'] != w_storage: continue
        
        # Word inclusion
        matches = True
        for w in jp_words:
            if len(w) > 2 and w not in wp['norm_name']:
                matches = False
                break
                
        if matches:
            possible_matches.append(wp)
            
    if len(possible_matches) > 0:
        match = possible_matches[0]
        if match['price'] == jp['price']:
            match_count += 1
        else:
            mismatch_count += 1
            output += f"| {jp['name']} | {jp['ram']}/{jp['storage']} | ₹{jp['price']} | ₹{match['price']} | ❌ MISMATCH |\n"
    else:
        not_found += 1

summary = f"## Summary\n"
summary += f"- **Total in JSON:** {len(json_flat)}\n"
summary += f"- **Total in Website:** {len(web_products)}\n"
summary += f"- **Perfect Matches:** {match_count}\n"
summary += f"- **Price Mismatches:** {mismatch_count}\n"
summary += f"- **Could not match:** {not_found}\n\n"

open('d:/downloadss/shreeshyam mobiles/price-comparison.md', 'w', encoding='utf-8').write(summary + output)
print("Comparison done. Check price-comparison.md")

import urllib.request
import json
import os

PAGES = {
    "notion_spec.md": "3f4d9083-8362-80f6-99d9-d6fb243f6819",
    "competencia_spec.md": "403d9083-8362-80a0-8eb1-ef4baaf03f0e"
}

def fetch_page_blocks(page_id):
    url = "https://www.notion.so/api/v3/loadPageChunk"
    data = json.dumps({
        "pageId": page_id,
        "limit": 250,
        "cursor": {"stack": []},
        "chunkNumber": 0,
        "verticalColumns": False
    }).encode("utf-8")
    
    headers = {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0"
    }
    
    req = urllib.request.Request(url, data=data, headers=headers)
    res = json.loads(urllib.request.urlopen(req).read().decode())
    raw_blocks = res.get("recordMap", {}).get("block", {})
    
    blocks = {}
    for k, v in raw_blocks.items():
        val = v.get("value", {})
        if "value" in val:
            val = val["value"]
        blocks[k] = val
    return blocks

def format_rich_text(elements):
    if not elements:
        return ""
    text = ""
    for part in elements:
        if isinstance(part, list):
            s = part[0]
            if len(part) > 1 and isinstance(part[1], list):
                for style in part[1]:
                    if style[0] == "b":
                        s = f"**{s}**"
                    elif style[0] == "i":
                        s = f"*{s}*"
                    elif style[0] == "c":
                        s = f"`{s}`"
                    elif style[0] == "a":
                        s = f"[{s}]({style[1]})"
            text += s
        elif isinstance(part, str):
            text += part
    return text

def parse_page_to_markdown(root_id, blocks):
    lines = []
    
    def render_table(table_block):
        col_order = table_block.get("format", {}).get("table_block_column_order", [])
        rows = table_block.get("content", [])
        
        table_lines = []
        for idx, row_id in enumerate(rows):
            row_block = blocks.get(row_id, {})
            row_props = row_block.get("properties", {})
            cells = []
            for col_id in col_order:
                cell_content = row_props.get(col_id, [])
                cell_text = format_rich_text(cell_content).replace("\n", "<br>")
                cells.append(cell_text.strip())
            table_lines.append("| " + " | ".join(cells) + " |")
            if idx == 0:
                table_lines.append("| " + " | ".join(["---"] * len(col_order)) + " |")
        return "\n".join(table_lines)

    def parse_block(b_id, indent=0):
        b = blocks.get(b_id, {})
        if not b:
            return
        b_type = b.get("type")
        txt = format_rich_text(b.get("properties", {}).get("title", []))
        prefix = "  " * indent

        if b_type == "header":
            lines.append(f"\n# {txt}")
        elif b_type == "sub_header":
            lines.append(f"\n## {txt}")
        elif b_type == "sub_sub_header":
            lines.append(f"\n### {txt}")
        elif b_type == "header_4":
            lines.append(f"\n#### {txt}")
        elif b_type == "to_do":
            checked = b.get("properties", {}).get("checked", [["No"]])[0][0] == "Yes"
            mark = "[x]" if checked else "[ ]"
            lines.append(f"{prefix}{mark} {txt}")
        elif b_type == "bulleted_list":
            lines.append(f"{prefix}* {txt}")
        elif b_type == "numbered_list":
            lines.append(f"{prefix}1. {txt}")
        elif b_type == "callout":
            lines.append(f"> [!NOTE]\n> {txt}")
        elif b_type == "quote":
            lines.append(f"> {txt}")
        elif b_type == "divider":
            lines.append("\n---\n")
        elif b_type == "table":
            lines.append("\n" + render_table(b) + "\n")
            return
        elif b_type == "table_row":
            return
        elif b_type == "page":
            if b_id != root_id:
                lines.append(f"📄 **Página vinculada:** [{txt}](notion://{b_id})")
            else:
                lines.append(f"# {txt}\n")
        else:
            if txt:
                lines.append(f"{prefix}{txt}")

        for child in b.get("content", []):
            parse_block(child, indent + (1 if b_type in ["bulleted_list", "numbered_list", "to_do"] else 0))

    parse_block(root_id)
    return "\n".join(lines)

def sync():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    docs_dir = os.path.join(base_dir, "docs")
    os.makedirs(docs_dir, exist_ok=True)
    for filename, page_id in PAGES.items():
        print(f"Sincronizando {filename}...")
        blocks = fetch_page_blocks(page_id)
        md = parse_page_to_markdown(page_id, blocks)
        target_path = os.path.join(docs_dir, filename)
        with open(target_path, "w", encoding="utf-8") as f:
            f.write(md)
        print(f"-> {filename} guardado con éxito ({len(md)} bytes).")

if __name__ == "__main__":
    sync()

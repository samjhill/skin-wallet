import svgwrite
from cairosvg import svg2png

def write_seed_phrase_to_svg(filename, seed_words):
    svg_document = svgwrite.Drawing(filename=filename, size=("800px", "800px"))
    svg_document.embed_font("Bree Serif", "./fonts/Bree_Serif/BreeSerif-Regular.ttf")

    with open("./styles/main.css") as f:
        lines = f.readlines()
        svg_document.embed_stylesheet(" ".join(lines))

    svg_document.add(
        svg_document.rect(
            insert=(10, 10),
            size=("200px", len(seed_words) * 31),
            stroke_width="2",
            stroke="black",
            fill="none",
        )
    )

    for i in range(0, len(seed_words)):
        svg_document.add(svg_document.text(seed_words[i], insert=(20, (i * 30) + 45)))

    svg_document.save()

    return svg_document


def write_decryption_key_to_svg(filename, shift_numbers, shape="rect"):
    doc_width = 400
    doc_height = 400
    svg_document = svgwrite.Drawing(filename=filename, size=(f"{doc_width}px", f"{doc_height}px"))
    colors = ["red", "blue", "green", "black"]

    for i in range(0, len(shift_numbers)):
        num_items_per_row = shift_numbers[i]
        for j in range(0, num_items_per_row):
            width = doc_width / num_items_per_row

            if shape == "rect":
                svg_document.add(
                    svg_document.rect(
                        insert=(((width) * j) + 40, (num_items_per_row * 20) + 20),
                        size=(f"{width}px", "40px"),
                        stroke_width="3",
                        stroke=colors[i],
                        fill="none",
                    )
                )
            elif shape == "circle":
                svg_document.add(
                    svg_document.circle(
                        center=(doc_width - (width * j + 20), i * 25 + 20),
                        r=("10px"),
                        stroke_width="3",
                        stroke=colors[i],
                        fill="none",
                    )
                )
            else:
                print("The allowed shapes are 'rect' or 'circle'")
                return False

    svg_document.save()

    return svg_document


def write_svg_to_png(filename, svg):
    svg2png(bytestring=open(svg).read().encode('utf-8'), write_to=filename)


if __name__ == "__main__":
    write_decryption_key_to_svg("test-key.svg", [2, 8, 1, 4], shape="circle")
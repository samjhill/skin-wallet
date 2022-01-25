import svgwrite


def write_text_to_svg(filename, seed_words):
    svg_document = svgwrite.Drawing(filename=filename, size=("800px", "800px"))
    svg_document.embed_font("Bree Serif", "./fonts/Bree_Serif/BreeSerif-Regular.ttf")

    with open("./styles/main.css") as f:
        lines = f.readlines()
        svg_document.embed_stylesheet(" ".join(lines))

    svg_document.add(
        svg_document.rect(
            insert=(10, 10),
            size=("180px", len(seed_words) * 31),
            stroke_width="2",
            stroke="black",
            fill="none",
        )
    )

    for i in range(0, len(seed_words)):
        svg_document.add(svg_document.text(seed_words[i], insert=(20, (i * 30) + 45)))

    svg_document.save()

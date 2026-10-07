import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx";
import { writeFile } from "node:fs/promises";

const cell = (text) => new TableCell({ children: [new Paragraph(text)] });
const doc = new Document({
  sections: [
    {
      children: [
        new Paragraph({
          text: "Nestly PG Finder",
          heading: HeadingLevel.TITLE,
        }),
        new Paragraph("GitHub Copilot Features Practical Report"),
        new Paragraph({
          text: "1. Practical objective",
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph(
          "This sample application demonstrates how GitHub Copilot can support a software development process from idea to working product. Nestly helps normal users discover available PGs and gives owners a profile/dashboard view for managing their space.",
        ),
        new Paragraph({
          text: "2. Technology stack",
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph(
          "Node.js, Express.js, MongoDB/Mongoose, Tailwind CSS, browser Drag and Drop API, HTML, CSS and JavaScript.",
        ),
        new Paragraph({
          text: "3. Three main features",
          heading: HeadingLevel.HEADING_1,
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [cell("Feature"), cell("Implementation and value")],
            }),
            new TableRow({
              children: [
                cell("PG search and filtering"),
                cell(
                  "GET /api/pgs supports area, budget, gender and room type filters. The UI updates results as users interact with the controls.",
                ),
              ],
            }),
            new TableRow({
              children: [
                cell("Owner profile dashboard"),
                cell(
                  "An owner-focused panel shows profile identity, verification, response rate, rating and inquiries, with a route ready for listing management.",
                ),
              ],
            }),
            new TableRow({
              children: [
                cell("Drag-and-drop shortlist"),
                cell(
                  "Listing cards use draggable=true and dragstart/dragend events. Users can drag a home card as a natural shortlist gesture.",
                ),
              ],
            }),
          ],
        }),
        new Paragraph({
          text: "4. Four side features",
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph(
          "1. Verified badges and review ratings improve trust.\n2. Responsive Tailwind CSS layout adapts to mobile and desktop.\n3. MongoDB persistence is available through Mongoose, with demo data keeping the application usable during development.\n4. REST health and publish endpoints support maintainability and future integrations.",
        ),
        new Paragraph({
          text: "5. GitHub Copilot capabilities demonstrated",
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph(
          "Code generation: Copilot can generate Express route scaffolding, Mongoose schemas, reusable card templates and UI structure from natural-language prompts.\n\nCode completion: While building filters and event handlers, Copilot can infer repetitive DOM wiring, query-string construction and HTML template patterns.\n\nDebugging: Copilot can help interpret API errors, missing MongoDB connections, filter mismatches and browser event behavior, then suggest focused fixes.\n\nDocumentation: Copilot can draft the README, API descriptions, feature map and this report, while the developer reviews accuracy.\n\nDeveloper productivity: Copilot reduces boilerplate and helps move quickly between backend contracts, UI states and tests, leaving the developer to make product and design decisions.",
        ),
        new Paragraph({
          text: "6. Testing and validation",
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph(
          "Start the server with npm run dev, open the browser, test each filter, drag a card, click the owner dashboard button, and check GET /api/health. With MongoDB running, POST a listing to verify persistence; without it, the demo fallback validates the user experience.",
        ),
        new Paragraph({
          text: "7. Conclusion",
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph(
          "Nestly demonstrates that GitHub Copilot is most effective as a development partner: it accelerates implementation, suggests patterns and explains problems, while the developer remains responsible for architecture, security, UX decisions, testing and code review.",
        ),
      ],
    },
  ],
});
const buffer = await Packer.toBuffer(doc);
await writeFile("report.docx", buffer);
console.log("Created report.docx");

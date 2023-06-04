# Architektur

## Data Actions
- EVENT_CELL_MOVE
- UPDATE_DATA_CELL
- DELETE_DATA_CELL
- MOVE_DATA_COL
- INSERT_DATA_COLUMN
- DELETE_DATA_COLUMN
- MOVE_DATA_ROW
- INSERT_DATA_COLUMN
- DELETE_DATA_COLUMN

## Classes

```mermaid
classDiagram
    class Plugin {
        +onload(): void
        +onunload(): void
    }

    class CsvTablePlugin {
        +loadSettings(): void
        +saveSettings(): void
        +setMarkdownView(WorkspaceLeaf, bool): void
    }

    Plugin <|-- CsvTablePlugin

    class TextFileView {
        +getViewType(): void
        +getDisplayText(): string
        +onOpen(): void
        +onClose(): void
        +onload(): void
        +getViewData(): string
        +setViewData(string, boolean): void
        +clear(): void
    }

    class CsvView {
        +Constructor(WorkspaceLeaf, CsvTablePlugin)
        getViewType(): s
    }

    TextFileView <|-- CsvView

    CsvTablePlugin ..> CsvView : creates
```


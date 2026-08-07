import * as React from "react";
import {
  X,
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Download,
  Trash2,
} from "lucide-react";
import { type CreateQuestionFormData } from "./CreateSingleQuestionModal";

interface ImportCsvModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (questions: CreateQuestionFormData[]) => Promise<void> | void;
  isSubmitting?: boolean;
  defaultPartNumber?: number;
}

export default function ImportCsvModal({
  isOpen,
  onClose,
  onImport,
  isSubmitting = false,
  defaultPartNumber = 1,
}: ImportCsvModalProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const [parsedQuestions, setParsedQuestions] = React.useState<
    CreateQuestionFormData[]
  >([]);
  const [error, setError] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setFile(null);
      setParsedQuestions([]);
      setError(null);
      setIsDragging(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Simple CSV parser supporting double quotes and standard commas
  const parseCsvContent = (text: string): CreateQuestionFormData[] => {
    const lines = text
      .split(/\r\n|\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length < 2) {
      throw new Error(
        "CSV file must contain a header row and at least one data row.",
      );
    }

    // Split CSV line respecting quoted strings
    const splitCsvLine = (line: string): string[] => {
      const result: string[] = [];
      let current = "";
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"' && (i === 0 || line[i - 1] !== "\\")) {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          result.push(current.trim().replace(/^"|"$/g, ""));
          current = "";
        } else {
          current += char;
        }
      }
      result.push(current.trim().replace(/^"|"$/g, ""));
      return result;
    };

    const headers = splitCsvLine(lines[0]).map((h) => h.toLowerCase());

    const contentIdx = headers.indexOf("content");
    const optAIdx = headers.indexOf("option_a");
    const optBIdx = headers.indexOf("option_b");
    const optCIdx = headers.indexOf("option_c");
    const optDIdx = headers.indexOf("option_d");
    const rightAnsIdx = headers.indexOf("right_answer");
    const partNumIdx = headers.indexOf("part_number");
    const expIdx = headers.indexOf("explanation");

    if (
      contentIdx === -1 ||
      optAIdx === -1 ||
      optBIdx === -1 ||
      optCIdx === -1 ||
      optDIdx === -1 ||
      rightAnsIdx === -1
    ) {
      throw new Error(
        "Missing required headers. Required: content, option_a, option_b, option_c, option_d, right_answer",
      );
    }

    const questions: CreateQuestionFormData[] = [];

    for (let i = 1; i < lines.length; i++) {
      const row = splitCsvLine(lines[i]);
      if (row.length < 6) continue;

      const content = row[contentIdx] || "";
      const optionA = row[optAIdx] || "";
      const optionB = row[optBIdx] || "";
      const optionC = row[optCIdx] || "";
      const optionD = row[optDIdx] || "";
      let rightAns = (row[rightAnsIdx] || "A").toUpperCase().trim();

      if (!["A", "B", "C", "D"].includes(rightAns)) {
        rightAns = "A";
      }

      const partNum =
        partNumIdx !== -1 && row[partNumIdx]
          ? parseInt(row[partNumIdx], 10) || defaultPartNumber
          : defaultPartNumber;

      const explanation = expIdx !== -1 ? row[expIdx] || "" : "";

      if (content && optionA && optionB && optionC && optionD) {
        questions.push({
          content,
          options: {
            A: optionA,
            B: optionB,
            C: optionC,
            D: optionD,
          },
          right_answer: rightAns as "A" | "B" | "C" | "D",
          category: "TOEIC",
          partNumber: partNum,
          explanation,
        });
      }
    }

    if (questions.length === 0) {
      throw new Error("No valid question rows found in the CSV file.");
    }

    return questions;
  };

  const handleFileChange = (selectedFile: File) => {
    setError(null);
    if (!selectedFile.name.endsWith(".csv")) {
      setError("Please select a valid CSV file (.csv).");
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = parseCsvContent(text);
        setParsedQuestions(parsed);
      } catch (err: any) {
        setError(err.message || "Failed to parse CSV file format.");
        setParsedQuestions([]);
      }
    };

    reader.readAsText(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const downloadSampleCsv = () => {
    const csvHeader =
      "content,option_a,option_b,option_c,option_d,right_answer,part_number,explanation\n";
    const sampleRow1 =
      '"What is the speaker announcing?","A new policy","A store opening","A product delay","A retirement",A,1,"The speaker announces the release of a new policy."\n';
    const sampleRow2 =
      '"When will the meeting take place?","At 9 AM","At 2 PM","Tomorrow","Next week",B,2,"The manager specifically mentioned 2 PM."\n';

    const blob = new Blob([csvHeader + sampleRow1 + sampleRow2], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "toeic_questions_sample.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedQuestions.length === 0) return;

    try {
      await onImport(parsedQuestions);
      onClose();
    } catch (err: any) {
      setError(
        err?.data?.message || "Failed to import questions. Please try again.",
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white border border-neutral-200/80 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-neutral-800">
                Import Questions from CSV
              </h2>
              <p className="text-[11px] text-neutral-400 font-medium">
                Bulk import multiple choice questions into your exam suite
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-2.5 text-xs text-rose-700 font-medium">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Download CSV Template Bar */}
          <div className="flex items-center justify-between p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl">
            <div className="text-xs text-indigo-900 font-medium">
              Need the correct format? Download our sample CSV template.
            </div>
            <button
              type="button"
              onClick={downloadSampleCsv}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Sample CSV</span>
            </button>
          </div>

          {/* Upload Area */}
          {!file ? (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                isDragging
                  ? "border-indigo-500 bg-indigo-50/20"
                  : "border-neutral-200 hover:border-indigo-400 hover:bg-neutral-50/50"
              }`}
            >
              <input
                type="file"
                accept=".csv"
                id="csv-file-input"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />
              <label
                htmlFor="csv-file-input"
                className="cursor-pointer space-y-3 block"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-neutral-800">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-[11px] text-neutral-400 font-medium mt-0.5">
                    CSV files only (max 5MB)
                  </p>
                </div>
              </label>
            </div>
          ) : (
            /* File Preview & Questions List */
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 bg-neutral-50 border border-neutral-200/80 rounded-xl">
                <div className="flex items-center space-x-3">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-xs font-bold text-neutral-800">
                      {file.name}
                    </p>
                    <p className="text-[10px] text-neutral-400 font-medium">
                      {(file.size / 1024).toFixed(1)} KB •{" "}
                      {parsedQuestions.length} questions parsed
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setParsedQuestions([]);
                  }}
                  className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {parsedQuestions.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-700">
                      Parsed Questions Preview
                    </span>
                    <span className="inline-flex items-center space-x-1 text-[11px] text-emerald-600 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ready for import</span>
                    </span>
                  </div>

                  <div className="max-h-60 overflow-y-auto border border-neutral-200/80 rounded-xl divide-y divide-neutral-100 bg-white">
                    {parsedQuestions.map((q, idx) => (
                      <div key={idx} className="p-3 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-neutral-800">
                            {idx + 1}. {q.content}
                          </span>
                          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold rounded text-[10px]">
                            Part {q.partNumber} • Answer: {q.right_answer}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-500 font-medium pt-1">
                          <span>A: {q.options.A}</span>
                          <span>B: {q.options.B}</span>
                          <span>C: {q.options.C}</span>
                          <span>D: {q.options.D}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-neutral-100 bg-neutral-50/50">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={parsedQuestions.length === 0 || isSubmitting}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all flex items-center space-x-2 cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-4 h-4" />
            <span>
              {isSubmitting
                ? "Importing..."
                : `Import ${parsedQuestions.length} Questions`}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

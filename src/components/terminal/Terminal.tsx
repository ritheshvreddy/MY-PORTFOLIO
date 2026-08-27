import "./Terminal.css";

import { useEffect, useRef, useState } from "react";

import { banner } from "./TerminalBanner";
import { runCommand } from "./TerminalEngine";

import { buildRegistry } from "./CommandRegistry";

import { getTerminalCommands } from "../../services/terminal.service";

import { useSettings } from "../../contexts/SettingsContext";

import { downloadFile } from "../../utils/download";

interface Line {
  type: "command" | "output" | "error";
  text: string;
}

export default function Terminal() {
  const [history, setHistory] = useState<Line[]>(
    banner.map((line) => ({
      type: "output",
      text: line,
    }))
  );

  const [input, setInput] = useState("");

  const [commandHistory, setCommandHistory] =
    useState<string[]>([]);

  const [historyIndex, setHistoryIndex] =
    useState(-1);

  const [loadingCommands, setLoadingCommands] =
    useState(true);

  const { settings } = useSettings();

  const inputRef =
    useRef<HTMLInputElement>(null);

  const terminalBodyRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function initialize() {
      const commands =
        await getTerminalCommands();

      buildRegistry(commands);

      setLoadingCommands(false);

      inputRef.current?.focus();
    }

    initialize();
  }, []);

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTo({
        top:
          terminalBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }

    inputRef.current?.focus();
  }, [history]);

  const executeCommand = () => {
    const command = input.trim();

    if (loadingCommands) return;

    if (!command) return;

    const result =
      runCommand(command);

    let newHistory: Line[] = [
      ...history,
      {
        type: "command",
        text: `$ ${command}`,
      },
    ];

    if (result.type === "clear") {
      newHistory = banner.map((line) => ({
        type: "output",
        text: line,
      }));
    } else {
      result.output.forEach((line) => {
        newHistory.push({
          type:
            result.type === "error"
              ? "error"
              : "output",
          text: line,
        });
      });

      // Resume Download

      if (result.type === "resume") {
  if (settings?.resume_url) {
    downloadFile(
      settings.resume_url,
      "Rithesh_V_Reddy_Resume.pdf"
    );
  }
}
    }

    setHistory(newHistory);

    setCommandHistory((prev) => [
      ...prev,
      command,
    ]);

    setHistoryIndex(-1);

    setInput("");
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      executeCommand();
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();

      if (!commandHistory.length)
        return;

      const index =
        historyIndex === -1
          ? commandHistory.length - 1
          : Math.max(
              historyIndex - 1,
              0
            );

      setHistoryIndex(index);

      setInput(commandHistory[index]);
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();

      if (historyIndex === -1)
        return;

      const index =
        historyIndex + 1;

      if (
        index >=
        commandHistory.length
      ) {
        setHistoryIndex(-1);

        setInput("");

        return;
      }

      setHistoryIndex(index);

      setInput(commandHistory[index]);
    }
  };

  return (
    <section className="terminal-page">
      <div className="terminal-window">
        <div className="terminal-header">
          <div className="terminal-controls">
            <span className="control red"></span>

            <span className="control yellow"></span>

            <span className="control green"></span>
          </div>

          <div className="terminal-title">
            {(
              settings?.portfolio_name ??
              "portfolio"
            )
              .replace(/\s+/g, "")
              .toLowerCase()}
            @portfolio:~ $
          </div>

          <div className="terminal-status">
            ● Connected
          </div>
        </div>

        <div
          className="terminal-body"
          ref={terminalBodyRef}
        >
          {history.map((line, index) => (
            <div
              key={index}
              className={`terminal-line ${line.type}`}
            >
              {line.text}
            </div>
          ))}

          <div className="terminal-input-row">
            <span>$</span>

            <input
              ref={inputRef}
              value={input}
              onChange={(e) =>
                setInput(
                  e.target.value
                )
              }
              onKeyDown={
                handleKeyDown
              }
              autoComplete="off"
              spellCheck={false}
              disabled={
                loadingCommands
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
}
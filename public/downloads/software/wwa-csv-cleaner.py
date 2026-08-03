#!/usr/bin/env python3
"""
WWA CSV Cleaner — sample Python marketplace script.
Usage: python wwa-csv-cleaner.py input.csv output.csv
"""
from __future__ import annotations

import csv
import sys
from pathlib import Path


def clean_row(row: dict[str, str]) -> dict[str, str]:
    cleaned = {}
    for key, value in row.items():
        k = (key or "").strip().lower().replace(" ", "_")
        v = (value or "").strip()
        if v.lower() in {"n/a", "na", "null", "none"}:
            v = ""
        cleaned[k] = v
    return cleaned


def main(argv: list[str]) -> int:
    if len(argv) < 3:
        print("Usage: python wwa-csv-cleaner.py input.csv output.csv")
        return 1

    src = Path(argv[1])
    dst = Path(argv[2])
    if not src.exists():
        print(f"Missing input file: {src}")
        return 1

    seen = set()
    rows_out = []
    with src.open(newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        fieldnames = None
        for row in reader:
            cleaned = clean_row(row)
            if fieldnames is None:
                fieldnames = list(cleaned.keys())
            fingerprint = tuple(cleaned.get(k, "") for k in fieldnames)
            if fingerprint in seen:
                continue
            seen.add(fingerprint)
            rows_out.append(cleaned)

    if not fieldnames:
        print("No rows found.")
        return 1

    with dst.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows_out)

    print(f"Wrote {len(rows_out)} unique rows → {dst}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))

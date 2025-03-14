"use client";
import { useState } from "react";
import { Document, Page } from "react-pdf";

function PdfComp({ pdfFile }: any) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <div className="p-2 mt-5 ">
      <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
      <p>
        Page {pageNumber} of {numPages}
      </p>
        {Array.apply(null, Array(numPages))
          .map((x: any, i: number) => i + 1)
          .map((page: any) => {
            return (
              <Page
              className="mb-3 flex justify-center"
              width={700}
              height={700}
                pageNumber={page}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            );
          })}
      </Document>
     
    </div>
  );
}

export default PdfComp;

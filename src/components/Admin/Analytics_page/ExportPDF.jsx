import React from "react";
import jsPDF from "jspdf";
import { Button } from "@chakra-ui/react";
import domtoimage from "dom-to-image-more";

export default function ExportKpisPDF({ targetRef, fileName = "kpi-report.pdf" }) {
  const handleExport = async () => {
    try {
      if (!targetRef.current) {
        alert("No KPI section found!");
        return;
      }

      const element = targetRef.current;

     
      const scale = 2;
      const style = {
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        width: `${element.offsetWidth}px`,
        height: `${element.offsetHeight}px`,
      };

   
      const cloned = element.cloneNode(true);
      Object.assign(cloned.style, style);

      const wrapper = document.createElement("div");
      wrapper.appendChild(cloned);
      document.body.appendChild(wrapper);


      
      const dataUrl = await domtoimage.toPng(cloned, {
        quality: 1,
        bgcolor: "#ffffff",
        cacheBust: true,
        width: element.offsetWidth * scale,
        height: element.offsetHeight * scale,
      });

     
      document.body.removeChild(wrapper);

      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(fileName);

      console.log("HD PDF created successfully!");
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Error generating PDF. Check console.");
    }
  };

  return (
    <Button colorScheme="blue" onClick={handleExport}>
      Export PDF
    </Button>
  );
}

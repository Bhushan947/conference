import { createRoot } from "react-dom/client";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import RegistrationTicket from "../components/RegistrationTicket";

function bytesToBase64(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export async function generateTicketPdfBase64(registrationData) {
  const desktopCanvasWidth = 1123;
  const desktopCanvasHeight = 794;
  const mount = document.createElement("div");
  mount.style.position = "fixed";
  mount.style.left = "-20000px";
  mount.style.top = "0";
  mount.style.width = `${desktopCanvasWidth}px`;
  mount.style.minHeight = `${desktopCanvasHeight}px`;
  mount.style.overflow = "hidden";
  mount.style.zIndex = "-1";
  document.body.appendChild(mount);

  const root = createRoot(mount);

  try {
    const ticketElement = await new Promise((resolve, reject) => {
      const timeout = window.setTimeout(() => {
        reject(new Error("Timed out while generating ticket preview"));
      }, 10000);

      root.render(
        <RegistrationTicket
          registrationData={registrationData}
          onClose={() => {}}
          forceDesktopLayout
          onTicketReady={(el) => {
            window.clearTimeout(timeout);
            resolve(el);
          }}
        />,
      );
    });

    const canvas = await html2canvas(ticketElement, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#f4efe4",
      logging: false,
      width: desktopCanvasWidth,
      height: desktopCanvasHeight,
      windowWidth: desktopCanvasWidth,
      windowHeight: desktopCanvasHeight,
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, "PNG", 0, 0, pageW, pageH, undefined, "FAST");

    const arrayBuffer = pdf.output("arraybuffer");
    return bytesToBase64(new Uint8Array(arrayBuffer));
  } finally {
    root.unmount();
    if (mount.parentNode) mount.parentNode.removeChild(mount);
  }
}

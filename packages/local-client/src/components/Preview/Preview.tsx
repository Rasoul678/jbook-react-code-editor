import { useRef, useEffect } from "react";
import "./preview.css";

interface PreviewProps {
  code: string | undefined;
  err: string | undefined
}

const html: string = `<html lang="en">
  <head>
    <title>code-iframe</title>
    <style>
      html{
        background-color: #fff;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>

    <script>
      const handleError = (err) => {
        const rootElement = document.querySelector('#root');
        rootElement.innerHTML = '<div style="color: crimson;"><h2>Runtime Error:</h2>' + err + '</div>';
        console.error(err);
      };

      window.addEventListener("error", (event) => {
        event.preventDefault();
        handleError(event.error);
      });

      window.addEventListener("message", (event) => {
        try{
          eval(event.data)
        } catch (error) {
          handleError(error);
        }
      }, false);
    </script>
  </body>
</html>`;

const Preview: React.FC<PreviewProps> = (props) => {
  const { code, err } = props;

  const iframeRef = useRef<any>();

  useEffect(() => {
    iframeRef.current.srcdoc = html;

    setTimeout(() => {
      iframeRef.current?.contentWindow.postMessage(code, "*");
    }, 100);
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        ref={iframeRef}
        srcDoc={html}
        sandbox="allow-scripts allow-modals"
        title="preview"
        className="preview-iframe"
      />
      {err && <div className='preview-error'>{err}</div>}
    </div>
  );
};

export default Preview;

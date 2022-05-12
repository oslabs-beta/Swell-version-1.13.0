import React, { useState, useEffect } from 'react';
// import CodeMirror from '@uiw/react-codemirror';
import { useSelector } from 'react-redux';
// import 'codemirror/addon/edit/matchbrackets';
// import 'codemirror/addon/edit/closebrackets';
// import 'codemirror/theme/twilight.css';
// import 'codemirror/lib/codemirror.css';
// import 'codemirror/addon/hint/show-hint';
// import 'codemirror/addon/hint/show-hint.css';
// import 'codemirror-graphql/hint';
// import 'codemirror-graphql/lint';
// import 'codemirror-graphql/mode';
// import 'codemirror/addon/lint/lint.css';
import Editor from "@monaco-editor/react";


const GraphQLBodyEntryForm = (props) => {
  const {
    newRequestBody,
    newRequestBody: { bodyContent },
    newRequestBody: { bodyIsNew },
    setNewRequestBody,
    warningMessage,
    introspectionData,
  } = props;

  const [cmValue, setValue] = useState(bodyContent);

  // set a new value for codemirror only if loading from history or changing query type
  useEffect(() => {
    if (!bodyIsNew) setValue(bodyContent);
  }, [bodyContent]);

  const isDark = useSelector((store) => store.ui.isDark);

  return (
    <div className="mt-3">
      {
        // conditionally render warning message
        warningMessage ? <div>{warningMessage.body}</div> : null
      }
      <div className="composer-section-title">Body</div>
      <div id="gql-body-entry" className={`${isDark ? 'is-dark-400' : ''}is-neutral-200-box p-3`}>
      <Editor
            height="90vh"
            defaultLanguage="javascript"
            defaultValue="// some comment"
          />
        {/* <CodeMirror
          value={cmValue}
          options={{
            mode: 'graphql',
            theme: 'neo sidebar',
            scrollbarStyle: 'native',
            lineNumbers: false,
            lint: true,
            hintOptions: true,
            matchBrackets: true,
            autoCloseBrackets: true,
            indentUnit: 2,
            tabSize: 2,
          }}
          editorDidMount={(editor) => {
            editor.setSize('100%', 150);
          }}
          height="200px"
          onBeforeChange={(editor, data, value) => {
            const optionObj = {
              schema: introspectionData.clientSchema,
              completeSingle: false,
            };
            setValue(value);
            editor.setOption('lint', optionObj);
            editor.setOption('hintOptions', optionObj);
          }}
          onChange={(editor, data, value) => {
            editor.showHint();
            setNewRequestBody({
              ...newRequestBody,
              bodyContent: value,
              bodyIsNew: true,
            });
          }}
        /> */}
      </div>
    </div>
  );
};

export default GraphQLBodyEntryForm;

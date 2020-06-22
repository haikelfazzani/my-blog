import React, { useEffect, useState, useContext } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import CardImg from '../components/CardImg';
import GlobalContext from '../state/GlobalContext';
import Iframe from '../components/Iframe';
import { Helmet } from 'react-helmet';
import Editor from '../containers/Editor';
import loadComments from '../util/loadComments';

function Snippet (props) {

  let { title } = useParams();
  const { globalState } = useContext(GlobalContext);
  const [snipData, setSnipData] = useState(null);
  const [snipCode, setSnipCode] = useState(null);

  useEffect(() => {

    let isMounted = true;
    let localSnippets = localStorage.getItem('js-snippets');

    if (isMounted && (globalState.snippets || localSnippets)) {

      localSnippets = globalState.snippets || JSON.parse(localSnippets);

      let snip = localSnippets.find(s => s.title === title);
     
      setSnipData(snip);

      if (snip && snip.code) {

        loadComments(title);

        fetch(snip.code).then(res => res.text())
          .then(resp => { setSnipCode(resp); })
          .catch(e => { onGoBack(); });
      }      
    }
    else {
      onGoBack();
    }

    return () => { isMounted = false; }
  }, []);

  const onGoBack = () => { props.history.goBack(); }

  return (<div className="content py-5">

    {snipData && <>

      <Helmet>
        <meta charSet="utf-8" />
        <title>{snipData.language} - {snipData.title.replace(/-|_/g, ' ')}</title>
        <meta name="description" content={snipData.description} />
      </Helmet>

      <button className="btn btn-dark btn-go-back" onClick={onGoBack}>
        <i className="fa fa-arrow-left"></i>
      </button>

      <CardImg snippet={snipData} />

      <div className="w-100">
        {snipCode
          ? <Editor
            jsvalue={snipCode}
            lang={snipData.language === 'algorithms' ? 'javascript' : snipData.language}
          />
          : <Iframe src={snipData.embed} embedName={snipData.embedname} />}
      </div>
    </>}

    <div id="graphcomment"></div>
  </div>);
}

export default withRouter(Snippet);
import React, { useState, useEffect, useRef } from 'react';
import './AppStyle.scss';

import Table from './components/table';
// import { settings } from 'cluster';

// import * as data from './data/data.json';

function BaseTen() {

  const [data, setData] = useState(():any => {});
  const [language, setLanguage] = useState("en");
  const [taskCounter, updateTaskCounter] = useState(-1);
  const [taskLength, settaskLength] = useState(0);
  const [pageId, setPageID] = useState('0');
  const [slideId, setSlideID] = useState('0');
  const [questionSet, setQuestionSet] = useState(():any => {});
  const [toolsTitle, setToolsTitle] = useState('');
  const [toolsSubtitle, setToolsSubTitle] = useState('');
  // const [toolmode, settoolmode] = useState('');
  const [langLabels, setLangLabels] = useState({});  
  const [task, settask] = useState();
  const [quaudio, setQuaudio] = useState("");  
  const [instruction, setInstruction] = useState("");

  // Fetching JSON and setting data
  useEffect(() => {
    // let ppath = window.location.toString().split('=')[1];
    const fetchData = async () => {
      const response = await fetch(
        // './data/'+ppath+'.json'
        './data/data.json'
      );
      const jsonData = await response.json();
      
      setData(jsonData);
      setLanguage(jsonData.language);
      updateTaskCounter(0);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Each counter/task update
  useEffect(() => {
    if(data === undefined) return;
    
    
    settaskLength(data.questionSet.length);

    setToolsTitle(data['langLabels'][language]['title']);
    setToolsSubTitle(data['langLabels'][language]['mode'][data.questionSet[taskCounter]['mode']]);
    setLangLabels(data['langLabels'][language])

    // let dir = language === 'ar' ? "rtl" : "ltr"
    // document.documentElement.dir = dir;
    document.documentElement.lang = language;
    setQuestionSet(data.questionSet[taskCounter]);
    // settoolmode(data.questionSet[taskCounter]['mode']);
    setPageID(data.questionSet[taskCounter]['pageid'])
    setSlideID(data.questionSet[taskCounter]['id'])       
    settask(data.questionSet[taskCounter]['task']); 
    setQuaudio(data.questionSet[taskCounter]['quaudio']);     
    setInstruction(data.questionSet[taskCounter]['instruction']);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskCounter])        

  // Next/Previous Task Navigation
  const updateTask = (op: string) => {
    if (op === "+") {
      updateTaskCounter(taskCounter => taskCounter + 1)
    } else {
      updateTaskCounter(taskCounter => taskCounter - 1)
    }
    //console.log(op, taskCounter);
  }   
  
  const pageidref = useRef<HTMLDivElement>(null);

  // Event Tracking
  const dispatchEvntTrack = (action:any, value:any) => {

    let pageidelm = pageidref.current;
    let pageid:any = 0;
    let id:any = 0;

    if (pageidelm !== null) {
      let tmp = pageidelm.attributes[1]['nodeValue'];
      if(tmp === null) return;
      
      pageid = tmp.split(" ")[0];
      id = tmp.split(" ")[1];
    }
    
    const postData = {
        "type": "BEH_EVENT",
        "value": {
            "header": {
                "eventType": "content.completed"
            },
            "body": {
                "action": action,
                "object": {
                    "page_id": pageid,
                    "id": id,
                    "type": "baseten",
                    "name": "baseten"
                }
            },
            // "context": (action === "arraymanipulate" ? value : { "value": value })
            "context": value
        }
    }
    //console.log(postData);
    
    
    // Post Message
    window.parent.postMessage(postData, "*");
  }

  return (
    <div 
    id="BaseTenCont" 
    className={"BaseTen " + language}
    role = "main"
    >
      <header id="header" role = "none">        
        <h1
        tabIndex={0}
        aria-label={toolsTitle}
        >{toolsTitle}</h1>

        <h2
        tabIndex={0}
        aria-label={toolsSubtitle}
        >{toolsSubtitle}</h2>
      </header>

      <section id="section">            
        <Table
          language={language}
          langLabels={langLabels}
          questionSet={questionSet}          
          task={task}                   
          et={dispatchEvntTrack}
          updateTask={[updateTask, taskCounter, taskLength, slideId]}  
          quaudio = {quaudio}   
          instruction={instruction}   
        />      
      </section>       
      <div ref={pageidref} id="pageidref" className={pageId + ' ' + slideId}></div>
      <div id="reflector"></div>
    </div>
  )

}

export default BaseTen;

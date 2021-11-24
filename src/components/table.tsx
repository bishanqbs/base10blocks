import React, { useEffect, useState, useRef, KeyboardEvent } from 'react';
import QuesAud from './questionAudio';

declare global {
  interface Window {
    ContinueAdvancedVideo: any
  }
}

function Table(props: any) {

  const ContinueAdvancedVideo = () => {
    try {
      if (window.ContinueAdvancedVideo() !== undefined) {
        window.ContinueAdvancedVideo()
      }
    } catch (error) {
      console.log('Function "ContinueAdvancedVideo()" does not exist.');

    }
  }

  const [disableDrag0, setDisableDrag0] = useState(false);
  const [disableDrag1, setDisableDrag1] = useState(false);
  const [disableDrag2, setDisableDrag2] = useState(false);
  const [disableDrag3, setDisableDrag3] = useState(false);
  const [disableValidate, setDisableValidate] = useState(false);
  const [deleteCursor, setDeleteCursor] = useState(false);
  const [disableDelete, setdisableDelete] = useState(true);
  const [deleteActiveDrag, setDeleteActiveDrag] = useState(false);

  /*pop up*/
  const [hidePopupCont, setHidePopupCont] = useState(true);
  const [hidePopupReset, setHidePopupReset] = useState(true);
  const [hidePopupOk, setHidePopupOk] = useState(true);
  const [hidePopupTryAgain, setHidePopupTryAgain] = useState(true);

  const [displayAnswerBox, setDisplayAnswerBox] = useState(false);
  const [ansValue, setAnsValue] = useState("");

  const [countThd, setCountThd] = useState(0);
  const [countHun, setCountHun] = useState(0);
  const [countTen, setCountTen] = useState(0);
  const [countOne, setCountOne] = useState(0);

  const maxAttempt = props.task ? parseInt(props.task["attemptCount"]) : "";
  const [attemptCount, setAttemptCount] = useState(0);
  let baseTenCont = document.getElementById("BaseTenCont");
  let header = document.getElementById("header");
  let quesCont = document.getElementById("quesCont");
  let section = document.getElementById("section");
  const ArrItem = {
    "MaxThd": 9, "InRowThd": 2, "CountThd": 0, "MFactThd": 1000,
    "MaxHun": 9, "InRowHun": 2, "CountHun": 0, "MFactHun": 100,
    "MaxTen": 19, "InRowTen": 10, "CountTen": 0, "MFactTen": 10,
    "MaxOne": 29, "InRowOne": 10, "CountOne": 0, "MFactOne": 1,
  };

  /* eslint-disable no-unused-vars*/
  /* eslint-disable */
  // Once - Generate default gird
  /*
  useEffect(() => {

  }, [])
  */

  // Check on every check Buttont Hit
  useEffect(() => {
    if (props.checkBtnHit > 0) {
      //checkArrayFunction(props.task);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [props.checkBtnHit]);

  // Update grid while switching between task(s)
  useEffect(() => {
    if (props.questionSet !== undefined) {
      if (props.questionSet["mode"] === "equation") {
        baseTenCont?.classList.remove("explore");
        baseTenCont?.classList.add("equation");
        header?.classList.add("hiddenTag");
        quesCont?.classList.remove("displayNone");
        section?.classList.remove("explore");
        section?.classList.add("equation");
        setDisplayAnswerBox(false);
      }
      else {
        baseTenCont?.classList.remove("equation");
        baseTenCont?.classList.add("explore");
        header?.classList.remove("hiddenTag");
        quesCont?.classList.add("displayNone");
        section?.classList.remove("equation");
        section?.classList.add("explore");
        setDisplayAnswerBox(true);
        //console.log(displayValidate, attemptCount)
      }
    }

    if (props.questionSet !== undefined) {
      ResetColumn();
      ResetTextBox();
      DeleteCursorOFF();
      EnableDragControls();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.task]);

  const updateThdCol = (e: any, valThd: number, mode: string) => {
    //console.log(countThd);
    let TempCountThd = 0;
    if (mode === "add") {
      if ((valThd + 1) <= ArrItem.MaxThd) {
        setCountThd(countThd => valThd + 1);
        TempCountThd = valThd + 1;
      }
      DeleteCursorOFF();
    }
    else {
      if ((valThd + 1) >= 0) {
        setCountThd(countThd => valThd - 1);
        TempCountThd = valThd - 1;
      }
    }
    //console.log(TempCountThd);
    if (TempCountThd === ArrItem.MaxThd) { setDisableDrag0(true); }
    else { setDisableDrag0(false); }
    if (TempCountThd === 0 && countHun === 0 && countTen === 0 && countOne === 0) { setdisableDelete(true); DeleteCursorOFF(); }
    else { setdisableDelete(false); }

    let Num = (TempCountThd * ArrItem.MFactThd) + (countHun * ArrItem.MFactHun) + (countTen * ArrItem.MFactTen) + (countOne * ArrItem.MFactOne);
    let NewNum = ConvNumToComma(Num);
    setAnsValue(NewNum.toString());
  }

  const updateHunCol = (e: any, valHun: number, mode: string) => {
    let TempCountHun = 0;
    if (mode === "add") {
      if ((valHun + 1) <= ArrItem.MaxHun) {
        setCountHun(countHun => valHun + 1);
        TempCountHun = valHun + 1;
      }
      DeleteCursorOFF();
    }
    else {
      if ((valHun + 1) >= 0) {
        setCountHun(countHun => valHun - 1);
        TempCountHun = valHun - 1;
      }
    }
    if (TempCountHun === ArrItem.MaxHun) { setDisableDrag1(true); }
    else { setDisableDrag1(false); }
    if (countThd === 0 && TempCountHun === 0 && countTen === 0 && countOne === 0) { setdisableDelete(true); DeleteCursorOFF(); }
    else { setdisableDelete(false); }
    let Num = (countThd * ArrItem.MFactThd) + (TempCountHun * ArrItem.MFactHun) + (countTen * ArrItem.MFactTen) + (countOne * ArrItem.MFactOne);
    let NewNum = ConvNumToComma(Num);
    setAnsValue(NewNum.toString());
  }

  const updateTenCol = (e: any, valTen: number, mode: string) => {
    let TempCountTen = 0;
    if (mode === "add") {
      if ((valTen + 1) <= ArrItem.MaxTen) {
        setCountTen(countTen => valTen + 1);
        TempCountTen = valTen + 1;
      }
      DeleteCursorOFF();
    }
    else {
      if ((valTen + 1) >= 0) {
        setCountTen(countTen => valTen - 1);
        TempCountTen = valTen - 1;
      }
    }
    if (TempCountTen === ArrItem.MaxTen) { setDisableDrag2(true); }
    else { setDisableDrag2(false); }
    if (countThd === 0 && countHun === 0 && TempCountTen === 0 && countOne === 0) { setdisableDelete(true); DeleteCursorOFF(); }
    else { setdisableDelete(false); }
    let Num = (countThd * ArrItem.MFactThd) + (countHun * ArrItem.MFactHun) + (TempCountTen * ArrItem.MFactTen) + (countOne * ArrItem.MFactOne);
    let NewNum = ConvNumToComma(Num);
    setAnsValue(NewNum.toString());
  }

  const updateOneCol = (e: any, valOne: number, mode: string) => {
    let TempCountOne = 0;
    if (mode === "add") {
      if ((valOne + 1) <= ArrItem.MaxOne) {
        setCountOne(countOne => valOne + 1);
        TempCountOne = valOne + 1;
      }
      DeleteCursorOFF();
    }
    else {
      if ((valOne + 1) >= 0) {
        setCountOne(countOne => valOne - 1);
        TempCountOne = valOne - 1;
      }
    }
    if (TempCountOne === ArrItem.MaxOne) { setDisableDrag3(true); }
    else { setDisableDrag3(false); }
    if (countThd === 0 && countHun === 0 && countTen === 0 && TempCountOne === 0) { setdisableDelete(true); DeleteCursorOFF(); }
    else { setdisableDelete(false); }
    let Num = (countThd * ArrItem.MFactThd) + (countHun * ArrItem.MFactHun) + (countTen * ArrItem.MFactTen) + (TempCountOne * ArrItem.MFactOne);
    let NewNum = ConvNumToComma(Num);
    setAnsValue(NewNum.toString());
  }

  const EnableDragControls = () => {
    setDisableDrag0(false);
    setDisableDrag1(false);
    setDisableDrag2(false);
    setDisableDrag3(false);
    DeleteCursorOFF();
  }

  const ResetColumn = () => {
    setCountThd(0);
    setCountHun(0);
    setCountTen(0);
    setCountOne(0);
  }

  const ConvNumToComma = (x: number) => {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }

  const ResetTextBox = () => {
    let Num = 0;
    setAnsValue(Num.toString());
  }

  const DisableBottomControls = () => {
    //console.log("Called");
    setDisableDrag0(true);
    setDisableDrag1(true);
    setDisableDrag2(true);
    setDisableDrag3(true);
    setdisableDelete(true);
    setDisableValidate(true);
  }

  const EnableBottomControls = () => {
    setDisableValidate(false);
    setDisableDrag0(false);
    setDisableDrag1(false);
    setDisableDrag2(false);
    setDisableDrag3(false);
    setdisableDelete(false);
  }

  const onRightOkMD = (e: any) => {
    hidePopupBg();
    setHidePopupOk(true);
    setHidePopupCont(true);
    setDisableValidate(true);
    selectFocus("resetBtn");
    ContinueAdvancedVideo();
  }

  const onTryAgainMD = (e: any) => {
    hidePopupBg();
    setHidePopupTryAgain(true);
    setHidePopupCont(true);
    selectFocus("hintData");
  }

  const onContinueMD = (e: any) => {
    hidePopupBg();
    setHidePopupTryAgain(true);
    setHidePopupCont(true);
    ContinueAdvancedVideo();
  }

  // const setTryAgainBtn = () => {    
  //   var tryAgain = document.getElementById("tryAgain");
  //   var ncontinue = document.getElementById("continue");    
  //   if(attempCountUR.current === maxAttempt.current){ncontinue?.classList.remove("hideCont");}
  //   else if(attempCountUR.current < maxAttempt.current){tryAgain?.classList.remove("hideCont");}    
  // }  



  const onResetCancelMD = (e: any) => {
    hidePopupBg();
    setHidePopupReset(true);
    setHidePopupCont(true);
    selectFocus("resetBtn");
  }

  const onResetOkMD = (e: any) => {
    hidePopupBg();
    setHidePopupReset(true);
    setHidePopupCont(true);
    setHidePopupOk(true);
    setHidePopupTryAgain(true);
    ResetColumn();
    setAttemptCount(0);
    ResetTextBox();
    //UpdateBottomControls();
    DeleteCursorOFF();
    EnableDragControls();
    EnableBottomControls();
    selectFocus("ins_container");
  }

  const showPopupBg = () => {
    var popUpBg = document.getElementById("popUpBg");
    popUpBg?.classList.remove("hideCont");
  }

  const hidePopupBg = () => {
    var popUpBg = document.getElementById("popUpBg");
    popUpBg?.classList.add("hideCont");
  }

  const selectFocus = (elementName:string) => {
    setTimeout(function(){
      document.getElementById(elementName)?.focus();
    },250);
  }

  const showPopup = (popName: string) => {
    showPopupBg();
    setHidePopupCont(false);
    if (popName === "ok") {
      setHidePopupOk(false);
      selectFocus("imgRight");           
    }
    else if (popName === "ta") {
      setHidePopupTryAgain(false);
      selectFocus("tryAgain");             
    }
    else if (popName === "so") {
      setHidePopupReset(false);
      selectFocus("startOver");           
    }
  }

  const onValidateMD = (e: any) => {
    //match condition 1
    var RightStr = "";
    var RightStr2 = 0;
    var LeftStr = 0;
    // var TxtBox = document.getElementById("answerBox");
    // if(TxtBox !== null){
    //   if(TxtBox !== undefined){RightStr = TxtBox.innerHTML;} 
    // }   
    RightStr = ansValue.toString();
    RightStr2 = parseInt(RightStr.replace(/,/g, ''));

    LeftStr = parseInt(props.task["ansText"].replace(/,/g, ''));

    //console.log(LeftStr, RightStr2);

    //match condition 2
    let IsAllTrue = true;
    let ArrAns = [0, 0, 0, 0];

    ArrAns[0] = countThd;
    ArrAns[1] = countHun;
    ArrAns[2] = countTen;
    ArrAns[3] = countOne;

    for (let i = 0; i < ArrAns.length; i++) {
      if (ArrAns[i] !== parseInt(props.task["ansArr"][i])) {
        IsAllTrue = false;
      }
    }

    setAttemptCount(attemptCount => attemptCount + 1);
    if (LeftStr === RightStr2 && IsAllTrue) {
      showPopup("ok");
      DisableBottomControls();
    }
    else {
      showPopup("ta");
    }
    DeleteCursorOFF();
    //console.log(attemptCount, maxAttempt);
    if (attemptCount + 1 >= maxAttempt) {
      DisableBottomControls();
    }

    //console.log(attempCountUR.current, maxAttempt.current);
  }

  const onResetMD = (e: any) => {
    showPopup("so");
  }

  const DeleteCursorON = () => {
    setDeleteCursor(true);
    setDeleteActiveDrag(true);
  }

  const DeleteCursorOFF = () => {
    setDeleteCursor(false);
    setDeleteActiveDrag(false);
  }

  const onDeleteMD = (e: any) => {
    if (deleteCursor) {
      DeleteCursorOFF();
    }
    else {
      DeleteCursorON();
    }
  }

  //const [thousand,setThousand] = useState(9);

  const [insactive, setInsActive] = useState(false);

  return (
    <>
      {/* <button onClick = {(e) => {setThousand(thousand => thousand+1);}}>Set Thousand</button> */}     
      <div id="quesCont" className="row">
        {
          (props.instruction && props.instruction !== "") &&
          <div 
          id="ins_container"
          className={"ins_container" + (insactive ? ' active' : '')} 
          tabIndex={0} 
          onFocus={() => setInsActive(true)} 
          onBlur={() => setInsActive(false)}          
          >
            <img src={process.env.PUBLIC_URL + '/static/images/technical-hover.svg'} alt="info" aria-hidden="true" />
            <div className="ins_content" dangerouslySetInnerHTML={{ __html: props.instruction }}></div>
          </div>
        }

        {
          (props.quaudio && props.quaudio !== "") &&
          <QuesAud quesAudio={props.quaudio} task={props.task} ins={props.instruction} />
        }

        <div
          id="quesText"
          className="col-sm-12"
          tabIndex={0}
          // aria-label={props.task ? props.task["quesText"][props.language] : ""}          
        >
          {props.task ? props.task["quesText"][props.language] : ""}
        </div>

      </div>

      <div id="tableCont" className={deleteCursor ? "row col-sm-12 deleteCursor" : "row col-sm-12"}>
        <div className="col-sm-3 column" id="col0">
          <div className="row colHead" id="colHead0">{props.langLabels['column1']}</div>
          <div className="colBody" id="colBody0">
            {
              Array.from(Array(countThd), (e, i) => {
                return (
                  <button
                    className={deleteCursor ? "blkT deleteCursor" : "blkT"}
                    id={"blkT_" + (i)}
                    onMouseDown={(e) => { updateThdCol(e, countThd, "del"); }}
                    onKeyPress={(e) => { if (e.code === 'Space' || e.code === 'Enter') { updateThdCol(e, countThd, "del"); } }}
                    tabIndex={deleteCursor ? 0 : -1}
                    aria-label="Select to delete a thousand block."                    
                  >

                  </button>
                )
              })
            }
          </div>
        </div>

        <div className="col-sm-3 column" id="col1">
          <div className="row colHead" id="colHead1">{props.langLabels['column2']}</div>
          <div className="colBody" id="colBody1" >
            {
              Array.from(Array(countHun), (e, i) => {
                return (
                  <button
                    className={deleteCursor ? "blkH deleteCursor" : "blkH"}
                    id={"blkH_" + (i)}
                    onMouseDown={(e) => { updateHunCol(e, countHun, "del"); }}
                    onKeyPress={(e) => { if (e.code === 'Space' || e.code === 'Enter') { updateHunCol(e, countHun, "del"); } }}
                    tabIndex={deleteCursor ? 0 : -1}
                    aria-label="Select to delete a hundred block."                    
                  >

                  </button>
                )
              })
            }
          </div>
        </div>

        <div className="col-sm-3 column" id="col2">
          <div className="row colHead" id="colHead2">{props.langLabels['column3']}</div>
          <div className="colBody" id="colBody2" >
            {
              Array.from(Array(countTen), (e, i) => {
                return (
                  <button
                    className={deleteCursor ? "blkTen deleteCursor" : "blkTen"}
                    id={"blkTen_" + (i)}
                    onMouseDown={(e) => { updateTenCol(e, countTen, "del"); }}
                    onKeyPress={(e) => { if (e.code === 'Space' || e.code === 'Enter') { updateTenCol(e, countTen, "del"); } }}
                    tabIndex={deleteCursor ? 0 : -1}
                    aria-label="Select to delete a ten block."                    
                  >

                  </button>
                )
              })
            }
          </div>
        </div>

        <div className="col-sm-3 column" id="col3">
          <div className="row colHead" id="colHead3">{props.langLabels['column4']}</div>
          <div className="colBody" id="colBody3" >
            <div className="colBodyCol" id="colBody3_0">
              {
                Array.from(Array(countOne), (e, i) => {
                  return (
                    <>
                      {(i < 10) &&
                        <button
                          className={deleteCursor ? "blkOne deleteCursor" : "blkOne"}
                          id={"blkOne_" + (i)}
                          onMouseDown={(e) => { updateOneCol(e, countOne, "del"); }}
                          onKeyPress={(e) => { if (e.code === 'Space' || e.code === 'Enter') { updateOneCol(e, countOne, "del"); } }}
                          tabIndex={deleteCursor ? 0 : -1}
                          aria-label="Select to delete an one block."                          
                        >

                        </button>
                      }
                    </>
                  )
                })
              }

            </div>
            <div className="colBodyCol" id="colBody3_1">
              {
                Array.from(Array(countOne), (e, i) => {
                  return (
                    <>
                      {(i > 9 && i < 20) &&
                        <button
                          className={deleteCursor ? "blkOne deleteCursor" : "blkOne"}
                          id={"blkOne_" + (i)}
                          onMouseDown={(e) => { updateOneCol(e, countOne, "del"); }}
                          onKeyPress={(e) => { if (e.code === 'Space' || e.code === 'Enter') { updateOneCol(e, countOne, "del"); } }}
                          tabIndex={deleteCursor ? 0 : -1}
                          aria-label="Select to delete an one block."                          
                        >

                        </button>
                      }
                    </>
                  )
                })
              }
            </div>
            <div className="colBodyCol" id="colBody3_2">
              {
                Array.from(Array(countOne), (e, i) => {
                  return (
                    <>
                      {(i > 19 && i < 30) &&
                        <button
                          className={deleteCursor ? "blkOne deleteCursor" : "blkOne"}
                          id={"blkOne_" + (i)}
                          onMouseDown={(e) => { updateOneCol(e, countOne, "del"); }}
                          onKeyPress={(e) => { if (e.code === 'Space' || e.code === 'Enter') { updateOneCol(e, countOne, "del"); } }}
                          tabIndex={deleteCursor ? 0 : -1}
                          aria-label="Select to delete an one block."                          
                        >

                        </button>
                      }
                    </>
                  )
                })
              }
            </div>
          </div>





        </div>
      </div>

      <div
        id="hintCont"
        className={attemptCount >= 1 ? "row" : "row hideCont"}        
      >

        <div id="hintIconCont">
          <div 
          id="hintIcon"          
          role="presentation"
          ></div>
        </div>
        <div 
        id="hintData"
        tabIndex={attemptCount >= 1 ? 0 : -1}
        aria-label={props.task ? props.task["hint"] : ""}        
        >{props.task ? props.task["hint"] : ""}</div>
      </div>

      <div id="rowDragCont" className="">
        <div className="dragContBg">
          <button
            id="drag0"
            className={disableDrag0 ? "bottomBtns disableDrag" : "bottomBtns"}
            onMouseDown={(e) => { updateThdCol(e, countThd, "add"); }}
            onKeyPress={(e) => { if (e.code === 'Space' || e.code === 'Enter') { updateThdCol(e, countThd, "add"); } }}
            tabIndex={disableDrag0 ? -1 : 0}
            aria-label="Select to add a thousand block."             
          ></button>

          <button
            id="drag1"
            className={disableDrag1 ? "bottomBtns disableDrag" : "bottomBtns"}
            onMouseDown={(e) => { updateHunCol(e, countHun, "add"); }}
            onKeyPress={(e) => { if (e.code === 'Space' || e.code === 'Enter') { updateHunCol(e, countHun, "add"); } }}
            tabIndex={disableDrag1 ? -1 : 0}
            aria-label="Select to add a hundred block."            
          ></button>

          <button
            id="drag2"
            className={disableDrag2 ? "bottomBtns disableDrag" : "bottomBtns"}
            onMouseDown={(e) => { updateTenCol(e, countTen, "add"); }}
            onKeyPress={(e) => { if (e.code === 'Space' || e.code === 'Enter') { updateTenCol(e, countTen, "add"); } }}
            tabIndex={disableDrag2 ? -1 : 0}
            aria-label="Select to add a ten block."            
          ></button>

          <button
            id="drag3"
            className={disableDrag3 ? "bottomBtns disableDrag" : "bottomBtns"}
            onMouseDown={(e) => { updateOneCol(e, countOne, "add"); }}
            onKeyPress={(e) => { if (e.code === 'Space' || e.code === 'Enter') { updateOneCol(e, countOne, "add"); } }}
            tabIndex={disableDrag3 ? -1 : 0}
            aria-label="Select to add an one block."            
          ></button>

          <button
            id="resetBtn"
            className="bottomBtns"
            onMouseDown={(e) => { onResetMD(e); }}
            onKeyPress={(e) => { if (e.code === 'Space' || e.code === 'Enter') { onResetMD(e); } }}
            tabIndex={0}
            aria-label="Select to reset."            
          ></button>

          <button
            id="deleteBtn"
            className={(deleteActiveDrag ? "bottomBtns activeDrag" : (disableDelete ? "bottomBtns disableDrag" : "bottomBtns"))}
            onMouseDown={(e) => { onDeleteMD(e); }}
            onKeyPress={(e) => { if (e.code === 'Space' || e.code === 'Enter') { onDeleteMD(e); } }}
            tabIndex={disableDelete ? -1 : 0}
            aria-label="Select to delete blocks."            
          ></button>

        </div>
        <div id="rowAnsValidate" className="">
          <div
            id="answerBox"
            className={displayAnswerBox ? "" : "displayNone"}
            tabIndex={displayAnswerBox ? 0 : -1}
            aria-label={ansValue}            
          >{ansValue}</div>

          <button
            id="validate"
            className={(attemptCount >= maxAttempt) || (disableValidate) ? "disable" : ""}
            onMouseDown={(e) => { onValidateMD(e); }}
            onKeyPress={(e) => { if (e.code === 'Space' || e.code === 'Enter') { onValidateMD(e); } }}
            tabIndex={displayAnswerBox ? -1 : (disableValidate ? -1 : 0)}
            aria-label="Select to check answer."            
          >
            {props.langLabels['validate']}
            <span
              className="hintLabel"
              // tabIndex={displayAnswerBox? -1:0}
              // aria-label={"Number of attempt "+attemptCount +" of " + maxAttempt}
              //role="presentation"
              aria-hidden="true"
            >
              {attemptCount + " of " + maxAttempt}
            </span>
          </button>
        </div>
      </div>

      <div id="popUpCont" className={hidePopupCont ? "hideCont" : ""}>
        <div id="popUpReset" className={hidePopupReset ? "hideCont" : ""}>
          <div
           id="startOver" 
           className="row"
           tabIndex={hidePopupReset ? -1 : 0}
           aria-label={"Start over"}           
           >{props.langLabels['startover']}</div>
          <div className="row">
            <div className="col-sm-6">
              <button
                id="resetCancel"
                onMouseDown={(e) => { onResetCancelMD(e); }}
                onKeyPress={(e) => { if (e.code === 'Space' || e.code === 'Enter') { onResetCancelMD(e); } }}
                tabIndex={hidePopupReset ? -1 : 0}
                aria-label={"Cancel"}                
              >
                {props.langLabels['cancel']}
              </button>
            </div>

            <div className="col-sm-6">
              <button
                id="resetOk"
                onMouseDown={(e) => { onResetOkMD(e); }}
                onKeyPress={(e) => { if (e.code === 'Space' || e.code === 'Enter') { onResetOkMD(e); } }}
                tabIndex={hidePopupReset ? -1 : 0}
                aria-label={"Ok"}                
              >
                {props.langLabels['ok']}
              </button>
            </div>
          </div>
        </div>

        <div id="popUpOk" className={hidePopupOk ? "hideCont" : ""}>
          <div className="row">
            <div
             id="imgRight"
             tabIndex={hidePopupOk ? -1 : 0}
             aria-label="Correct answer"             
             ></div>
          </div>
          <div className="row">
            <div
              id="answerBox2"
              tabIndex={hidePopupOk ? -1 : 0}
              aria-label={ansValue}              
            >{ansValue}</div>
          </div>
          <div className="row">
            <button
              id="rightOk"
              onMouseDown={(e) => { onRightOkMD(e); }}
              onKeyPress={(e) => { if (e.code === 'Space' || e.code === 'Enter') { onRightOkMD(e); } }}
              tabIndex={hidePopupOk ? -1 : 0}
              aria-label={"Ok"}              
            >
              {props.langLabels['ok']}
            </button>
          </div>
        </div>

        <div id="popUpTryAgain" className={hidePopupTryAgain ? "hideCont" : ""}>
          <div className="row">
            <div id="imgWrong">
            </div>
          </div>
          <div className="row">
            <div id="answerBox3">{ansValue}</div>
          </div>
          <div className="row">
            <button
              id="tryAgain"
              className={attemptCount < maxAttempt ? "" : "hideCont"}
              onMouseDown={(e) => { onTryAgainMD(e); }}
              onKeyPress={(e) => { if (e.code === 'Space' || e.code === 'Enter') { onTryAgainMD(e); } }}
              tabIndex={hidePopupTryAgain ? -1 : 0}
              aria-label={"Incorrect answer try again."}              
            >
              {props.langLabels['tryagain']}
            </button>
            <button
              id="continue"
              className={attemptCount == maxAttempt ? "" : "hideCont"}
              onMouseDown={(e) => { onContinueMD(e); }}
              onKeyPress={(e) => { if (e.code === 'Space' || e.code === 'Enter') { onContinueMD(e); } }}
              tabIndex={hidePopupTryAgain ? -1 : 0}
              aria-label={"Incorrect answer continue."}              
            >
              {props.langLabels['continue']}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Table;

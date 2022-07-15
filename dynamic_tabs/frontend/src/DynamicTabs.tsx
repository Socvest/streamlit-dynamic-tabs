import {
  Streamlit,
  ComponentProps,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib"
import React, { ReactNode, useState } from "react"
import "./style.css"
import "./icon.css"
import { style } from 'glamor';

function DynamicTabs (props: ComponentProps) {

  const { args } = props
  const tabTitle:any[] = args["tabTitle"] 
  const limitTabs:boolean = args['limitTabs']
  const numOfTabs:number = args['numOfTabs']
  const addIcon:string = args['addIcon']
  const styles:any = args['styles'] || {}
 
  const [tab, setTab] = useState(tabTitle)
  const [btnState, setBtnState] = useState({activeTabId: null})
  const [inputClicked, setInputClicked] = useState({index:0, clicked:false})
  const [limitNumberOfTabs, setLimitNumberOfTabs] = useState({status: limitTabs, numOfTabs:numOfTabs})
  const [isHovering, setIsHovering] = useState({index:0, status:false});
  
  const newTab = () => {
    setTab([...tab, {title: ""}])

    const output = tab.length === 0 ? null : btnState.activeTabId
    setBtnState({activeTabId:output})
    const test = output === null ? 0 : tab
    //Streamlit.setComponentValue(test)
    console.log(test)
      
  }

  const deleteTab = (index:number) => {
    const tabList = [...tab]
      tabList.splice(index, 1)
      setTab(tabList)
      
      let bState = null
      if (index < btnState.activeTabId) {
        bState = btnState.activeTabId - 1; 
      } else if (index > btnState.activeTabId) {
        bState = btnState.activeTabId;
      } else if (index !== 0) {
        bState = btnState.activeTabId-1;
      } else if (index === 0) {
        bState = index;
      }
      
      setBtnState({activeTabId: bState})

      const output = tabList[bState]
      Streamlit.setComponentValue(output)
      Streamlit.setComponentReady()
  }

  const handleTabChange = (e:React.ChangeEvent<HTMLInputElement>, index:number) => {
    const {name, value} = e.target
    const list = [...tab]
    list[index][name] = value
    setTab(list)
  }

  function saveTitle(index:number){

    let output = tab[index]
    Streamlit.setComponentValue(output)
    Streamlit.setComponentReady()
    setInputClicked({index:index, clicked:false})
  }

  const updateActiveId = (id:number): void => {
    
    setBtnState({activeTabId:id})
    const output = tab[id]
    Streamlit.setComponentValue(output)
    Streamlit.setComponentReady()

  };

  const activeTabName = (id:number) => {
    if (id === btnState.activeTabId) {
      return "individual-tab-container tab-selected";
    } else {
      return "individual-tab-container";
    }
  };  

  const hideClose = (index:number) => {
    if (isHovering.index === index && isHovering.status === true) {
      return "fade-in 0.3s ease"
    } else {
      return "fade-out 0.3s ease"
    }
    
  }

  const handleMouseOver = (index:number) => {
    setIsHovering({index:index, status:true});
  };

  const handleMouseOut = (index:number) => {
    setIsHovering({index:index, status:false});
  };

  function inputClickHandler(index:number){
    setInputClicked({index:index, clicked:true})

  }

  return (
    <div className="dynamic-tabs" {...style(styles["dynamic-tabs"])}>
      <ul className="all-tabs" {...style(styles["all-tabs"])}>
      {tab.map((tabTitle, index) => (
        <span className="tab-container" onMouseEnter={() => handleMouseOver(index)} onMouseLeave={() => handleMouseOut(index)}>
        <span key={index} {...style(styles["individual-tab-container"])} {...style(styles["tab-selected"])} className={activeTabName(index)} onClick={() => updateActiveId(index)}>
        <li> 
          <span {...style(styles["title-close-save-button-container"])} className="title-close-save-button-container">
            <input 
                    {...style(styles["title-of-tab"])}
                    className="title-of-tab" 
                    name="title"
                    type="text"
                    required
                    placeholder="Rename tab here" 
                    size={20}
                    maxLength={20}
                    value = {tabTitle.title}
                    onClick={() => inputClickHandler(index)}
                    onChange={(e) => handleTabChange(e, index)}/>      
            </span>       
          </li> 
          </span>
          { inputClicked.index === index && inputClicked.clicked === true && 

            <div {...style(styles["save-button-container"])} className="save-button-container" style={{animation:"save-in 0.3s ease-in-out"}}>
              <button id="save" onClick={() => saveTitle(index)}>save</button></div> } 
              {isHovering.index === index && isHovering.status === true && tab.length > 1 &&
              
                <div {...style(styles["close-btn-container"])} style={{animation:hideClose(index)}} className="close-btn-container" > 
                <button type="button" className="close-btn" onClick={() => deleteTab(index)}>
                  <div className="close-btn-txt">&times;</div>
                  </button> </div> }
            
          </span>
    ))}
  </ul>
  { (limitNumberOfTabs.status === false || tab.length !== limitNumberOfTabs.numOfTabs) && 
    <span {...style(styles["new-tab-btn-container"])} className="new-tab-btn-container">
      <button type='button' className="new-tab-btn" onClick={newTab}>
      <i className="material-icons" id="add-btn">{addIcon}</i></button>
    </span>}
    </div>
  )
}

export default withStreamlitConnection(DynamicTabs);

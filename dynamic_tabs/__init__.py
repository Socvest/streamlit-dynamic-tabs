import os
import streamlit.components.v1 as components

_RELEASE = True

if not _RELEASE:
    _dynamic_tabs = components.declare_component(
        
        "dynamic_tabs",

        url="http://localhost:3001",
    )
else:
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "frontend/build")
    _dynamic_tabs = components.declare_component("dynamic_tabs", path=build_dir)

def dynamic_tabs(tabTitle=[{'title':''}], addIcon='add', limitTabs=False, numOfTabs=None,styles=None, key=None):
    
    component_value = _dynamic_tabs(tabTitle=tabTitle, addIcon=addIcon, limitTabs=limitTabs, numOfTabs=numOfTabs, styles=styles, key=key, default=0)


    return component_value


if not _RELEASE:
    import streamlit as st
    import time
    st.set_page_config(layout="wide")

    st.subheader("Dynamic Tabs")
    st.markdown('<style>' + open('./iFrame.css').read() + '</style>', unsafe_allow_html=True)

    styles = {'title-of-tab':{'border': 'solid'}} 

    if "tabs" not in st.session_state:
        st.session_state['tabs'] = [{'title':''}]

    existing_tabs = [{'title':''}] #[{'title':'Tab 1'}, {'title':'Tab 2'}]
 
    d_tabs = dynamic_tabs(tabTitle=existing_tabs, limitTabs=False, numOfTabs=0, styles=None, key="foo")
     
    if d_tabs == 0:
        time.sleep(1)
        st.info("""Click on a tab to view contents \n - Name tab by clicking in the input area \n - After renaming, click save to save the tab's title \n - To close the tab, hover over the tab click the close button that slides out""")
        st.stop()
    
    elif d_tabs['title'] == "":
        time.sleep(1)
        st.title("New Tab")
        
    else:
        time.sleep(1)
        title_placeholder = st.empty()
        title_placeholder.title(d_tabs['title'])
        if d_tabs['title'] == "":
            title_placeholder.title('New Tab')
            st.info("Create new tabs")
            if d_tabs != "":
                st.write("Inside tab")
                # what you want to show
            #st.stop()

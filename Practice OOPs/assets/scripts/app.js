class DOMHandler {
    static clearEventListeners(element){
        const clonedElement = element.cloneNode('true');
        element.replaceWith(clonedElement);
        return clonedElement;
    }

    static moveElement(elementId, newDestinationSelector){
        const element = document.getElementById(elementId);
        const destinationElement = document.querySelector(newDestinationSelector);
        destinationElement.append(element);
    }
}

class ToolTip {
    constructor(closeNotifierFn){
        this.closeNotifier = closeNotifierFn;
    }

    closeToolTip = () => {
        this.detach();
        this.closeNotifier();
    }

    detach(){
        this.element.remove();
    }

    show(){
        const tooltipElement = document.createElement('div');
        tooltipElement.className = 'card';
        tooltipElement.textContent = 'Hello....';
        tooltipElement.addEventListener('click', this.closeToolTip);
        this.element = tooltipElement;
        document.body.append(tooltipElement);
    }
}

class ProjectItem {
    hasTooltipActive = true;

    constructor(id, updateProjectListFunction, type){
        this.id = id;
        this.updateProjectListHandler = updateProjectListFunction;
        this.connectSwitchBtn(type);
        this.connectMoreInfoBtn();
    }

    showMoreInfo(){
        if(this.hasTooltipActive){
            return;
        }
        const tooltip = new ToolTip(() => { this.hasTooltipActive = false; });
        tooltip.show();
        this.hasTooltipActive = false;
    }

    connectMoreInfoBtn(){
        const projectItemElement = document.getElementById(this.id);
        const moreInfoBtn = projectItemElement.querySelector('button:first-of-type');
        moreInfoBtn.addEventListener('click', this.showMoreInfo);
    }

    connectSwitchBtn(type){
        const projItemElement = document.getElementById(this.id);
        let switchBtn = projItemElement.querySelector('button:last-of-type');
        switchBtn = DOMHandler.clearEventListeners(switchBtn);
        switchBtn.textContent = type === 'active' ? 'Finish' : 'Activate';
        switchBtn.addEventListener('click',this.updateProjectListHandler.bind(null,this.id));
    }

    update(updateProjectListFn, type){
        this.updateProjectListHandler = updateProjectListFn;
        this.connectSwitchBtn(type);
    }
}

class ProjectList {
    projects = [];

    constructor(projType){
        this.type = projType;
        const projItems = document.querySelectorAll(`#${projType}-projects li`);
        for(const projItem of projItems){
            this.projects.push(new ProjectItem(projItem.id, this.switchProject.bind(this), this.type));
        }
    }

    setSwitchHandlerFunction(switchHandlerFunction){
        this.switchHandler = switchHandlerFunction;
    }

    addProject(project){
        this.projects.push(project);
        DOMHandler.moveElement(project.id, `#${this.type}-projects ul`)
        project.update(this.switchProject.bind(this), this.type);
    }

    switchProject(projId){
        this.switchHandler(this.projects.find(p => p.id === projId));
        this.projects = this.projects.filter(p => p.id !== projId);
        // alternative to above is
        //const projIndex = this.projects.findIndex(p => pid === projId);
        //this.projects.slice(projIndex, 1);
    }
}

class App {
    static init(){
        const activeProjectsList = new ProjectList('active');
        const finishedProjectsList = new ProjectList('finished');
        activeProjectsList.setSwitchHandlerFunction(finishedProjectsList.addProject.bind(finishedProjectsList));
        finishedProjectsList.setSwitchHandlerFunction(activeProjectsList.addProject.bind(activeProjectsList));
    }
}

App.init();

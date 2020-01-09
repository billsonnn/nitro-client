import React from 'react';

export interface DialogHelperComponentProps
{
    defaultPos?: [] | string;
    subHeader?: boolean;
    axis?: any;
    resize?: boolean;
    styles?: {};
    minHeight?: number;
    minWidth?: number;
    show?: boolean;
    className?: string;
    background?: string;
    closeable?: boolean;
    top?: any;
    left?: any;
    id: string;
    title: string;
    children?: any;
    width: number;
    height: number;

    centered?: boolean;
}

export interface DialogHelperComponentState
{
    isShow: boolean;
    isResizing: boolean;
    isDragging: boolean;
    style: {
        width: number;
        height: number;
        top: number;
        left: number;
    };
}

export class DialogHelperComponent extends React.Component<DialogHelperComponentProps, DialogHelperComponentState>
{
    private static DEFAULT_PROPS = {
        defaultPos: [64, 64],
        subHeader: false,
        resize: false
    };

    constructor(props: DialogHelperComponentProps)
    {
		super(props)

        //this.handleScreenResize();

		this.state = {
			isShow: this.props.show || true,
			isResizing: false,
            isDragging: false,
            style: {
                width: this.props.width,
                height: this.props.height,
                top: this.props.top || 64,
                left: this.props.left || 64
            }
        }
    
        //this.close = this.close.bind(this);
    }
    
    // public componentDidMount(): void
    // {
    //     document.addEventListener('mousemove', this.handleMouse)
    //     document.addEventListener('mouseup', this.mouseStopEvent)
    //     window.addEventListener('resize', this.handleScreenResize)
    
    // }

    // componentWillUnmount()  {

    //     document.removeEventListener('mousemove', this.handleMouse)
    //     document.removeEventListener('mouseup', this.mouseStopEvent)
    //     window.removeEventListener('resize', this.handleScreenResize)
    
    // }

    // handleScreenResize = () => {
    //     this.screenHeight = window.innerHeight
    //     this.screenWidth = window.innerWidth
    // }

	// public handleDragging = (e: any) => {

    //     this.setState({
    //         isDragging: true
    //     })
    // }

	// public handleResizing() {
    //     this.setState({
    //         isResizing: true
    //     })
    // }

	// public mouseStopEvent = () => {

    //     if(this.state.isResizing) {

    //         this.setState({...this.state,
    //             isResizing: false
    //         })

    //     } else if(this.state.isDragging) {

    //         this.setState({...this.state,
    //             isDragging: false
    //         })

    //     }
    // }

	// public handleMouse = (e: MouseEvent) => {
        
    //     if (!this.state.isDragging && !this.state.isResizing) return

    //     if(this.state.isDragging){

    //         const top = this.state.style.top + e.movementY
    //         const left =  this.state.style.left + e.movementX

    //         if( top <= 0 || top >= this.screenHeight - this.state.style.height || 
    //             left <= 0 || left >= this.screenWidth - this.state.style.width) return

    //         this.setState({...this.state,
    //             style: {
    //                 ...this.state.style,
    //                 top,
    //                 left
    //             }
    //         })

    //     } else if(this.state.isResizing) {
            
    //         var width, height;

    //         var constraintX = this.props.axis == 'x' || this.props.axis == 'both'
    //         var constraintY = this.props.axis == 'y' || this.props.axis == 'both'

    //         width = this.state.style.width + e.movementX
	// 		if(width < this.minWidth) return

    //         height = this.state.style.height + e.movementY
	// 		if(height < this._minHeight) return
			

    //         this.setState({...this.state,
    //             style: {
    //                 ...this.state.style,
    //                 width: constraintX ? width : this.state.style.width,
    //                 height: constraintY ? height : this.state.style.height
    //             }
    //         })
    //     }
    // }

    public toggleShow(): void
    {
		this.setState({ isShow: !this.state.isShow });
	}

    public close(): void
    {
		this.setState({ isShow: false });
	}

    public render(): JSX.Element
    {
        if(!this.state.isShow) return null;
        
        return (
            <dialog className={`dialog ${this.props.className || ''}`} id={this.props.id} style={this.state.style}>
                <div className='dialog-header' id={(this.props.id) ? (this.props.id).concat('_header') : undefined } >
                    <span>{this.props.title}</span>
                    <div className='dialog-header-actions'>
                        <button className="btn btn-r63b btn-action btn-red" onClick={this.close}>
                            <i className="icon icon-close"></i>
                        </button>
                    </div>
				</div>
                <div className='dialog-body'>
					{this.props.children}
				</div>
			</dialog>
		);
	}
}
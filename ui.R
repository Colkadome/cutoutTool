shinyUI(fluidPage(id="main-page",
    
    tags$head(
        tags$title("Cutout Tool"),
        #tags$link(rel="shortcut icon", href="favicon.ico"),
        tags$style(HTML("
#image1 {
    position:absolute;
    top:128px;
    left:74px;
    pointer-events:none;
}
#plot1 img {
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;

    -webkit-user-drag: none;
    user-drag: none;
}
                        "))
    ),
    
    # title #
    #########
    
    h1("Cutout Tool"),
    
    # Main Content #
    ################
    
    plotOutput(outputId="plot1",clickId="click1",width=500,height=500)
    
))
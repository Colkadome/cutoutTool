shinyUI(fluidPage(id="main-page",
    
    tags$head(
        tags$title("Cutout Tool"),
        #tags$link(rel="shortcut icon", href="favicon.ico"),
        tags$style(HTML("
                        ")),
        tags$script(src="cutout.js")
    ),
    
    # title #
    #########
    
    h1("Cutout Tool"),
    
    # Main Content #
    ################
    
    sidebarLayout(
        sidebarPanel(
            h4("Ovals"),
            actionButton(inputId="testbutton1", label="Test button")
        ),
        mainPanel(
            tags$canvas(id="canvas1",width=420,height=420)
        )
    ),
    imageOutput(outputId="image1",width=420,height=420)
    
))
shinyUI(fluidPage(id="main-page",
    
    tags$head(
        tags$title("Cutout Tool"),
        #tags$link(rel="shortcut icon", href="favicon.ico"),
        tags$link(rel="stylesheet", type = "text/css", href = "cutout.css"),
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
            tags$ul(id="oval_list",
                    tags$li(
                        tags$button(id="add_oval", type="button", class="btn btn-default",
                                    span(class="glyphicon glyphicon-plus", "Add")
                                    )
                        )
                    ),
            tags$button(id="save_ovals", type="button", class="btn btn-default",
                        span("Save Ovals")
                        )
        ),
        mainPanel(
            tags$canvas(id="canvas1",width=420,height=420)
        )
    ),
    imageOutput(outputId="image1",width=420,height=420)
    
))
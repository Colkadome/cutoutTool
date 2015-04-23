shinyUI(fluidPage(id="main-page",
    
    tags$head(
        tags$title("Cutout Tool"),
        #tags$link(rel="shortcut icon", href="favicon.ico"),
        tags$link(rel="stylesheet", type = "text/css", href = "jquery-ui.min.css"),
        tags$link(rel="stylesheet", type = "text/css", href = "cutout.css"),
        tags$script(src="jquery-ui.min.js"),
        tags$script(src="cutout.js")
    ),
    
    # title #
    #########
    
    h1("Ellipse Overlay Tool"),
    
    # Main Content #
    ################
    
    sidebarLayout(
        sidebarPanel(
            h4("Ellipses"),
            tags$button(title="Add", id="add_ellipse",type="button",class="btn btn-default",span(class="glyphicon glyphicon-plus")),
            tags$button(title="Copy", id="copy_ellipse",type="button",class="btn btn-default",span(class="glyphicon glyphicon-record")),
            tags$button(title="Remove", id="remove_ellipse",type="button",class="btn btn-default",span(class="glyphicon glyphicon-minus")),
            tags$ul(id="ellipse_list"),
            h4("Points"),
            tags$button(title="Add", id="add_point",type="button",class="btn btn-default",span(class="glyphicon glyphicon-plus")),
            tags$button(title="Remove", id="remove_point",type="button",class="btn btn-default",span(class="glyphicon glyphicon-minus")),
            tags$ul(id="point_list"),
            tags$hr(),
            tags$button(id="save_items", type="button", class="btn btn-default",span("Save Items")),
            tags$button(id="clear_items", type="button", class="btn btn-default",span("Clear All")),
            actionButton(inputId="test_button", label="test button"),
            tags$hr(),
            h4("Colors"),
            tags$div(id="red"),
            tags$div(id="green"),
            tags$div(id="blue")
        ),
        mainPanel(
            tags$canvas(id="canvas1",width=420,height=420),
            br(),
            tags$button(id="zoom_in", type="button", class="btn btn-default",span(class="glyphicon glyphicon-plus")),
            tags$button(id="zoom_out", type="button", class="btn btn-default",span(class="glyphicon glyphicon-minus"))
        )
    ),
    imageOutput(outputId="image1",width=420,height=420)
    
))
shinyUI(fluidPage(id="main-page",
    
    tags$head(
        tags$title("Aperture Tool"),
        #tags$link(rel="shortcut icon", href="favicon.ico"),
        tags$link(rel="stylesheet", type = "text/css", href = "jquery-ui.min.css"),
        tags$link(rel="stylesheet", type = "text/css", href = "cutout.css"),
        tags$script(src="jquery-ui.min.js"),
        tags$script(src="cutout.js")
    ),
    
    # title #
    #########
    
    h1("Aperture Tool"),
    
    # Main Content #
    ################
    
    sidebarLayout(
        sidebarPanel(
            
            ## AARON's CODE ##
            textInput(inputId='initials',label='Initials',value='asgr'),
            actionButton(inputId="submit", label=span("Load Galaxy"), icon("random")),
            selectInput(inputId="CATAID", label="CATAID", choices=sort(tabscale[,'CATAID'])),
            ##################
            
            h4("Ellipses"),
            
            ## JAVASCRIPT
            tags$button(title="Add", id="add_ellipse",type="button",class="btn btn-default",span(class="glyphicon glyphicon-plus")),
            tags$button(title="Copy", id="copy_ellipse",type="button",class="btn btn-default",span(class="glyphicon glyphicon-record")),
            tags$button(title="Remove", id="remove_ellipse",type="button",class="btn btn-default",span(class="glyphicon glyphicon-minus")),
            tags$ul(id="ellipse_list"),
            ##
            
            h4("Points"),
            
            ## JAVASCRIPT
            tags$button(title="Add", id="add_point",type="button",class="btn btn-default",span(class="glyphicon glyphicon-plus")),
            tags$button(title="Remove", id="remove_point",type="button",class="btn btn-default",span(class="glyphicon glyphicon-minus")),
            tags$ul(id="point_list"),
            tags$hr(),
            tags$button(id="save_items", type="button", class="btn btn-default",span("Save Items")),
            tags$button(id="clear_items", type="button", class="btn btn-default",span("Clear All")),
            ##
            
            actionButton(inputId="test_button", label="test button"),
            tags$hr(),
            h4("Colors"),
            
            ## JAVASCRIPT
            tags$div(id="red"),
            tags$div(id="green"),
            tags$div(id="blue")
            ##
        ),
        mainPanel(
            ## JAVASCRIPT
            tags$canvas(id="canvas1",width=420,height=420),
            br(),
            tags$button(id="zoom_in", type="button", class="btn btn-default",span(class="glyphicon glyphicon-plus")),
            tags$button(id="zoom_out", type="button", class="btn btn-default",span(class="glyphicon glyphicon-minus")),
            ##
            
            ## AARON's CODE ##
            h3("ApMatchedv05"),
            dataTableOutput("tab1"),br(),
            h3("New"),
            dataTableOutput("tab2")
            ##################
        )
    )
    
))
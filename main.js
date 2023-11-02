const parse = () => {

    // clear converter textarea
    document.getElementById("pojos").value = '';
    let rootElementClassName = document.getElementById("root-element").value;

    if (rootElementClassName == '') {
        rootElementClassName = 'RootElement';
    }

    /* Advanced Options */

    // package naming
    let packageDefinition = "com.foobar.pojo";
    let isPackage = false;
    if (document.getElementById('package-options').style.visibility == 'visible' && document.getElementById("package-definition").value != '') {
        packageDefinition = document.getElementById("package-definition").value;
        isPackage = true;
    }

    // auto generation of import statements
    let isCreateImpots = false;
    if (document.getElementById('advanced-options').style.visibility == 'visible' && document.getElementById("import-options").checked) {
        isCreateImpots = true;
    }

    // access modifier 'private' for created fields
    let isPrivateFields = false;
    if (document.getElementById('advanced-options').style.visibility == 'visible' && document.getElementById("private-options").checked) {
        isPrivateFields = true;
    }

    // create getter and setter methods
    let isCreateGS = false;
    if (document.getElementById('advanced-options').style.visibility == 'visible' && document.getElementById("gs-options").checked) {
        isCreateGS = true;
    }

    // create builder methods
    let isBuilder = false;
    if (document.getElementById('advanced-options').style.visibility == 'visible' && document.getElementById("builder-options").checked) {
        isBuilder = true;
    }

    let config = {};
    config.identifier = rootElementClassName;
    config.packageDefinition = packageDefinition;
    config.isPackage = isPackage;
    config.isCreateImpots = isCreateImpots;
    config.isPrivateFields = isPrivateFields;
    config.isCreateGS = isCreateGS;
    config.isBuilder = isBuilder;

    try {
        let pojos = [];
        let json = document.getElementById("json").value;

        toPojo(pojos, json, config);

        pojos.forEach(p => {
            document.getElementById("pojos").value += p + '\n\n';
        })
    } catch (error) {
        console.log(error);
        document.getElementById("pojos").value = 'Error parsing JSON';
    }
}

const optionsClick = (o) => {
    let isVisible = document.getElementById(o).style.visibility;
    if (isVisible == 'hidden') {
        document.getElementById(o).style.visibility = 'visible';
    } else {
        document.getElementById(o).style.visibility = 'hidden';
    }
}
function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
function downloadjson() {
    // Create a popup box element
    const popupBox = document.createElement('div');
    popupBox.id = 'popup-box';
    popupBox.style.position = 'fixed';
    popupBox.style.top = '50%';
    popupBox.style.left = '50%';
    popupBox.style.transform = 'translate(-50%, -50%)';
    popupBox.style.width = '300px';
    popupBox.style.height = '180px';
    popupBox.style.backgroundColor = 'white';
    popupBox.style.border = '1px solid black';
    popupBox.style.padding = '2px 16px';
    popupBox.style.margin = '10px';
    popupBox.style.background = 'transparent';
    popupBox.style.boxShadow = '0 8px 16px 0 rgba(0,0,0,0.2)';
    popupBox.style.zIndex = '1000'; // Ensure it's above other elements

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.textContent = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.color='red';
  
    // Add a click event listener to the close button
    closeButton.addEventListener('click', function() {
      // Remove the popup box from the document body
      document.body.removeChild(popupBox);
    });
  
    // Add the close button to the popup box
    popupBox.appendChild(closeButton);
    // Create a text input element for the filename
    const filenameInput = document.createElement('input');
    filenameInput.type = 'text';
    filenameInput.id = 'filename-input';
    filenameInput.placeholder = 'Enter the filename (with .java extension)';
    filenameInput.style.marginTop='30px';
    filenameInput.style.width= '100%';
    filenameInput.style.padding= '0px 20px';
    // filenameInput.style.margin= '8px 0';
    filenameInput.style.border='2px solid black';
    filenameInput.style.boxSizing='border-box';
  
    // Create an error message element
    const errorMessage = document.createElement('div');
    errorMessage.style.color = 'red';
    errorMessage.style.marginTop = '10px';
  
    // Create a submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'button';
    submitButton.textContent = 'Submit';
    submitButton.style.color='green';
  
    // Add a click event listener to the submit button
    submitButton.addEventListener('click', function() {
      // Get the filename from the text input element
      const filename = filenameInput.value.trim();
  
      if (filename.endsWith('.java')) {
        // Trigger the download using the download function
        download(filename, document.getElementById('pojos').value);
  
        // Hide the popup box
        document.body.removeChild(popupBox);
      } else {
        // Show an error message for incorrect file extension
        errorMessage.textContent = 'Invalid file extension. Please enter a .java file.';
      }
    });
  
    // Add the filename input element, error message, and the submit button to the popup box
    popupBox.appendChild(filenameInput);
    popupBox.appendChild(errorMessage);
    popupBox.appendChild(submitButton);
  
    // Add the popup box to the document body
    document.body.appendChild(popupBox);
  
    // Focus the filename input element
    filenameInput.focus();
  }
  

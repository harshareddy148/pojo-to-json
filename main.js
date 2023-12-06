const parse = () => {
    // Clear converter textarea
    document.getElementById("pojos").value = '';

    let rootElementClassName = document.getElementById("root-element").value || 'RootElement';

    /* Advanced Options */

    // Package naming
    let packageDefinition = "com.foobar.pojo";
    let isPackage = false;
    if (document.getElementById('package-options').style.visibility === 'visible' && document.getElementById("package-definition").value !== '') {
        packageDefinition = document.getElementById("package-definition").value;
        isPackage = true;
    }

    // Auto generation of import statements
    let isCreateImpots = document.getElementById('advanced-options').style.visibility === 'visible' && document.getElementById("import-options").checked;

    // Access modifier 'private' for created fields
    let isPrivateFields = document.getElementById('advanced-options').style.visibility === 'visible' && document.getElementById("private-options").checked;

    // Create getter and setter methods
    let isCreateGS = document.getElementById('advanced-options').style.visibility === 'visible' && document.getElementById("gs-options").checked;

    // Create builder methods
    let isBuilder = document.getElementById('advanced-options').style.visibility === 'visible' && document.getElementById("builder-options").checked;

    const config = {
        identifier: rootElementClassName,
        packageDefinition,
        isPackage,
        isCreateImpots,
        isPrivateFields,
        isCreateGS,
        isBuilder,
    };

    try {
        const pojos = [];
        const json = document.getElementById("json").value;

        toPojo(pojos, json, config);

        pojos.forEach(pojo => {
            document.getElementById("pojos").value += pojo + '\n\n';
        });
    } catch (error) {
        console.error(error);
        document.getElementById("pojos").value = 'Error parsing JSON';
    }
};

const optionsClick = (o) => {
    const isVisible = document.getElementById(o).style.visibility;
    document.getElementById(o).style.visibility = isVisible === 'hidden' ? 'visible' : 'hidden';
};

function download(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function zipAndDownloadFolders(folders, fileName, callback) {
    const zip = new JSZip();

    folders.forEach(folder => {
        const folderInZip = zip.folder(folder.folderName);

        folder.files.forEach(file => {
            folderInZip.file(file.name, file.content);
        });
    });

    zip.generateAsync({ type: 'blob' }).then(content => {
        callback(content, fileName);
    });
}

// function createJavaFolderStructure(javaFolders) {
//     const folders = [];

//     javaFolders.forEach(javaFolder => {

//         const folder = {
//             name: javaFolder.folderName,
//             files: [],
//         };

//         javaFolder.files.forEach(file => {
//             const pojo = document.getElementById("pojos").value;
//             folder.files.push({
//                 name: file.name,
//                 content: pojo,
//             });
//         });

//         folders.push(folder);
//     });

//     zipAndDownloadFolders(folders, 'custom-zip-file-name', (content, customZipFileName) => {
//         const link = document.createElement('a');
//         link.href = URL.createObjectURL(content);
//         link.download = customZipFileName + '.zip';
//         // Append the link to the document body and trigger the download
//         document.body.appendChild(link);
//         link.click();

//         // Remove the link from the document body
//         document.body.removeChild(link);

//         // Remember to revoke the object URL after you're done using it
//         URL.revokeObjectURL(link.href);
//     });
// }
function createJavaFolderStructure(javaFolders) {
    const zip = new JSZip();

    javaFolders.forEach(javaFolder => {
        const folder = zip.folder(javaFolder.folderName);

        javaFolder.files.forEach(file => {
            if (file.name === 'pojo.java') {
                const pojo = document.getElementById("pojos").value;
                folder.file(file.name, pojo);
            } else {
                folder.file(file.name, file.content);
            }
        });
    });

    zip.generateAsync({ type: 'blob' }).then(content => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = 'custom-zip-file-name.zip'; // Set the desired zip file name
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    });
}

let javaFolders = [
    {
        folderName: 'com',
        files: [
            {
                name: 'App.java',
                content:
                    'public class App {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World!");\n\t}\n}',
            },
        ],
    },
    {
        folderName: 'com.foobar',
        files: [
            {
                name: 'Example.java',
                content: 'document.getElementById("pojos").value += pojo ',
            },
            {
                name: 'pojo.java',
                content: '',
            },
        ],
    },
];
document.getElementById('pojos').addEventListener('click', function() {
    createJavaFolderStructure(javaFolders);
});

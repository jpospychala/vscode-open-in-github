'use strict';

const querystring = require('querystring');
const expect = require('chai').expect;
const proxyquire = require('proxyquire');

const gitProvider = require('../src/gitProvider');

const userName = 'testUser';
const repoName = 'testRepo';
const filePath = '/sampleDirectory/sampleTestFile.txt';
const branch = 'master';
const line = 123;

suite('gitProvider', function () {
    suite('GitHub', function () {
        const remoteUrl = `https://github.com/${userName}/${repoName}.git`;
        const provider = gitProvider(remoteUrl);

        suite('#webUrl(branch, filePath)', function () {
            test('should returns file URL', function () {
                const expectedUrl = `https://github.com/${userName}/${repoName}/blob/${branch}${filePath}`;
                const webUrl = provider.webUrl(branch, filePath);
                expect(webUrl).to.equal(expectedUrl);
            });
        });

        suite('#webUrl(branch, filePath, line)', function () {
            test('should returns file URL with line hash', function () {
                const expectedUrl = `https://github.com/${userName}/${repoName}/blob/${branch}${filePath}#L${line}`;
                const webUrl = provider.webUrl(branch, filePath, line);
                expect(webUrl).to.equal(expectedUrl);
            });
        });

        suite('#webUrl(branch)', function () {
            test('should returns repository root URL', function () {
                const expectedUrl = `https://github.com/${userName}/${repoName}/tree/${branch}`;
                const webUrl = provider.webUrl(branch);
                expect(webUrl).to.equal(expectedUrl);
            });
        });

        suite('with ssh remote URL', function () {
            const remoteUrl = `git@github.com:${userName}/${repoName}.git`;
            const provider = gitProvider(remoteUrl);

            suite('#webUrl(branch, filePath)', function () {
                test('should returns HTTPS URL', function () {
                    const expectedUrl = `https://github.com/${userName}/${repoName}/blob/${branch}${filePath}`;
                    const webUrl = provider.webUrl(branch, filePath);
                    expect(webUrl).to.equal(expectedUrl);
                });
            });
        });

        suite('with custom domain', function () {
            const testDomain = 'github.testdomain.com';
            const remoteUrl = `https://${testDomain}/${userName}/${repoName}.git`;

            const fakeVscode = {
                workspace: {
                    getConfiguration: function () {
                        return {
                            get: function () {
                                return testDomain;
                            },
                        };
                    },
                },
            };
            const gitProvider = proxyquire('../src/gitProvider.js', { vscode: fakeVscode });
            const provider = gitProvider(remoteUrl);

            suite('#webUrl(branch, filePath)', function () {
                test('should return custom domain URL', function () {
                    const expectedUrl = `https://${testDomain}/${userName}/${repoName}/blob/${branch}${filePath}`;
                    const webUrl = provider.webUrl(branch, filePath);
                    expect(webUrl).to.equal(expectedUrl);
                });
            });
        });
    });

    suite('Bitbucket', function () {
        const remoteUrl = `https://bitbucket.org/${userName}/${repoName}.git`;
        const provider = gitProvider(remoteUrl);

        suite('#webUrl(branch, filePath)', function () {
            test('should returns file URL', function () {
                const expectedUrl = `https://bitbucket.org/${userName}/${repoName}/src/${branch}${filePath}`;
                const webUrl = provider.webUrl(branch, filePath);
                expect(webUrl).to.equal(expectedUrl);
            });
        });

        suite('#webUrl(branch, filePath, line)', function () {
            test('should returns file URL with line hash', function () {
                const expectedUrl = `https://bitbucket.org/${userName}/${repoName}/src/${branch}${filePath}#cl-${line}`;
                const webUrl = provider.webUrl(branch, filePath, line);
                expect(webUrl).to.equal(expectedUrl);
            });
        });

        suite('#webUrl(branch)', function () {
            test('should returns repository root URL', function () {
                const expectedUrl = `https://bitbucket.org/${userName}/${repoName}/src/${branch}`;
                const webUrl = provider.webUrl(branch);
                expect(webUrl).to.equal(expectedUrl);
            });
        });

        suite('with ssh remote URL', function () {
            const remoteUrl = `git@bitbucket.org:${userName}/${repoName}.git`;
            const provider = gitProvider(remoteUrl);

            suite('#webUrl(branch, filePath)', function () {
                test('should returns HTTPS URL', function () {
                    const expectedUrl = `https://bitbucket.org/${userName}/${repoName}/src/${branch}${filePath}`;
                    const webUrl = provider.webUrl(branch, filePath);
                    expect(webUrl).to.equal(expectedUrl);
                });
            });
        });
    });

    suite('BitbucketServer', function () {
        const remoteUrl = `ssh://git@bitbucket.example.com:7999/${userName}/${repoName}.git`;
        const provider = gitProvider(remoteUrl);

        suite('#webUrl(branch, filePath)', function () {
            test('should returns file URL', function () {
                const expectedUrl = `https://bitbucket.example.com/${userName}/${repoName}/src/${branch}${filePath}`;
                const webUrl = provider.webUrl(branch, filePath);
                expect(webUrl).to.equal(expectedUrl);
            });
        });

        suite('#webUrl(branch, filePath, line)', function () {
            test('should returns file URL with line hash', function () {
                const expectedUrl = `https://bitbucket.org/${userName}/${repoName}/src/${branch}${filePath}#cl-${line}`;
                const webUrl = provider.webUrl(branch, filePath, line);
                expect(webUrl).to.equal(expectedUrl);
            });
        });

        suite('#webUrl(branch)', function () {
            test('should returns repository root URL', function () {
                const expectedUrl = `https://bitbucket.org/${userName}/${repoName}/src/${branch}`;
                const webUrl = provider.webUrl(branch);
                expect(webUrl).to.equal(expectedUrl);
            });
        });

        suite('with ssh remote URL', function () {
            const remoteUrl = `git@bitbucket.org:${userName}/${repoName}.git`;
            const provider = gitProvider(remoteUrl);

            suite('#webUrl(branch, filePath)', function () {
                test('should returns HTTPS URL', function () {
                    const expectedUrl = `https://bitbucket.org/${userName}/${repoName}/src/${branch}${filePath}`;
                    const webUrl = provider.webUrl(branch, filePath);
                    expect(webUrl).to.equal(expectedUrl);
                });
            });
        });

        suite('with custom domain', function () {
            const testDomain = 'github.testdomain.com';
            const remoteUrl = `https://${testDomain}/${userName}/${repoName}.git`;

            const fakeVscode = {
                workspace: {
                    getConfiguration: function () {
                        return {
                            get: function () {
                                return testDomain;
                            },
                        };
                    },
                },
            };
            const gitProvider = proxyquire('../src/gitProvider.js', { vscode: fakeVscode });
            const provider = gitProvider(remoteUrl);

            suite('#webUrl(branch, filePath)', function () {
                test('should return custom domain URL', function () {
                    const expectedUrl = `https://${testDomain}/${userName}/${repoName}/blob/${branch}${filePath}`;
                    const webUrl = provider.webUrl(branch, filePath);
                    expect(webUrl).to.equal(expectedUrl);
                });
            });
        });
    });

    suite('GitLab', function () {
        const remoteUrl = `https://gitlab.com/${userName}/${repoName}.git`;
        const provider = gitProvider(remoteUrl);

        suite('#webUrl(branch, filePath)', function () {
            test('should returns file URL', function () {
                const expectedUrl = `https://gitlab.com/${userName}/${repoName}/blob/${branch}${filePath}`;
                const webUrl = provider.webUrl(branch, filePath);
                expect(webUrl).to.equal(expectedUrl);
            });
        });

        suite('#webUrl(branch, filePath, line)', function () {
            test('should returns file URL with line hash', function () {
                const expectedUrl = `https://gitlab.com/${userName}/${repoName}/blob/${branch}${filePath}#L${line}`;
                const webUrl = provider.webUrl(branch, filePath, line);
                expect(webUrl).to.equal(expectedUrl);
            });
        });

        suite('#webUrl(branch)', function () {
            test('should returns repository root URL', function () {
                const expectedUrl = `https://gitlab.com/${userName}/${repoName}/tree/${branch}`;
                const webUrl = provider.webUrl(branch);
                expect(webUrl).to.equal(expectedUrl);
            });
        });

        suite('with ssh remote URL', function () {
            const remoteUrl = `git@gitlab.com:${userName}/${repoName}.git`;
            const provider = gitProvider(remoteUrl);

            suite('#webUrl(branch, filePath)', function () {
                test('should returns HTTPS URL', function () {
                    const expectedUrl = `https://gitlab.com/${userName}/${repoName}/blob/${branch}${filePath}`;
                    const webUrl = provider.webUrl(branch, filePath);
                    expect(webUrl).to.equal(expectedUrl);
                });
            });
        });
    });

    suite('VisualStudio', function () {
        const projectName = 'testProject';
        const remoteUrl = `https://test-account.visualstudio.com/${projectName}/_git/${repoName}.git`;
        const provider = gitProvider(remoteUrl);

        suite('#webUrl(branch, filePath)', function () {
            test('should returns file URL', function () {
                const expectedUrl = `https://test-account.visualstudio.com/${projectName}/_git/${repoName}`;
                const expectedQuery = {
                    path: filePath,
                    version: `GB${branch}`,
                };
                const webUrl = provider.webUrl(branch, filePath);
                const [url, query] = webUrl.split('?');
                expect(url).to.equal(expectedUrl);
                expect(querystring.parse(query)).to.deep.equal(expectedQuery);
            });
        });

        suite('#webUrl(branch, filePath, line)', function () {
            test('should returns file URL with line query', function () {
                const expectedUrl = `https://test-account.visualstudio.com/${projectName}/_git/${repoName}`;
                const expectedQuery = {
                    path: filePath,
                    version: `GB${branch}`,
                    line: String(line),
                };
                const webUrl = provider.webUrl(branch, filePath, line);
                const [url, query] = webUrl.split('?');
                expect(url).to.equal(expectedUrl);
                expect(querystring.parse(query)).to.deep.equal(expectedQuery);
            });
        });

        suite('#webUrl(branch)', function () {
            test('should returns repository root URL', function () {
                const expectedUrl = `https://test-account.visualstudio.com/${projectName}/_git/${repoName}`;
                const expectedQuery = {
                    version: `GB${branch}`,
                };
                const webUrl = provider.webUrl(branch);
                const [url, query] = webUrl.split('?');
                expect(url).to.equal(expectedUrl);
                expect(querystring.parse(query)).to.deep.equal(expectedQuery);
            });
        });

        suite('with ssh remote URL', function () {
            const remoteUrl = `ssh://test-account@test-account.visualstudio.com:22/${projectName}/_git/${repoName}.git`;
            const provider = gitProvider(remoteUrl);

            suite('#webUrl(branch, filePath)', function () {
                test('should returns HTTPS URL', function () {
                    const expectedUrl = `https://test-account.visualstudio.com/${projectName}/_git/${repoName}`;
                    const expectedQuery = {
                        path: filePath,
                        version: `GB${branch}`,
                    };
                    const webUrl = provider.webUrl(branch, filePath);
                    const [url, query] = webUrl.split('?');
                    expect(url).to.equal(expectedUrl);
                    expect(querystring.parse(query)).to.deep.equal(expectedQuery);
                });
            });
        });
    });
});

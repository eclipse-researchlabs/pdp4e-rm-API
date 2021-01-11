// /********************************************************************************
//  * Copyright (c) 2021,2021 Beawre Digital SL
//  *
//  * This program and the accompanying materials are made available under the
//  * terms of the Eclipse Public License 2.0 which is available at
//  * http://www.eclipse.org/legal/epl-2.0.
//  *
//  * SPDX-License-Identifier: EPL-2.0 3
//  *
//  ********************************************************************************/

using Core.AuditTrail.Interfaces.Services;
using Core.Database;
using GraphQL;
using GraphQL.Types;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace Core.Api.Controllers
{
    [Route("api/graphql"), ApiController, EnableCors("CorsRules")]
    public class GraphQlController : ControllerBase
    {
        private IAuditTrailService _auditTrailService;
        IDocumentExecuter executer;
        ISchema schema;

        public GraphQlController(ISchema schema, IDocumentExecuter executer, IAuditTrailService auditTrailService)
        {
            this.schema = schema;
            this.executer = executer;
            _auditTrailService = auditTrailService;
        }

        [HttpGet]
        public IActionResult Get(
            [FromQuery] string query,
            [FromQuery] string variables,
            [FromQuery] string operationName,
            [FromServices] BeawreContext dbContext,
            CancellationToken cancellation)
        {
            var jObject = ParseVariables(variables);
            return Ok(Execute(dbContext, query, operationName, jObject, cancellation).Result.Data);
        }

        async Task<ExecutionResult> Execute(
            BeawreContext dbContext,
            string query,
            string operationName,
            JObject variables,
            CancellationToken cancellation)
        {
            var options = new ExecutionOptions
            {
                Schema = schema,
                Query = query,
                OperationName = operationName,
                Inputs = variables?.ToInputs(),
                UserContext = dbContext,
                CancellationToken = cancellation,
#if (DEBUG)
                ExposeExceptions = true,
                EnableMetrics = true,
#endif
            };

            var result = await executer.ExecuteAsync(options);
            if (result.Errors?.Count > 0)
            {
                Response.StatusCode = (int) HttpStatusCode.BadRequest;
            }

            return result;
        }

        static JObject ParseVariables(string variables)
        {
            if (variables == null)
            {
                return null;
            }

            try
            {
                return JObject.Parse(variables);
            }
            catch (Exception exception)
            {
                throw new Exception("Could not parse variables.", exception);
            }
        }
    }
}